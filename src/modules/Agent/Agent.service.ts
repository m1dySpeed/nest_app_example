import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import {
  AGENT_COLLECTION,
  AgentDocument,
  AgentSchema,
} from '../Storage/shemas/Agents.schema';
import {
  AgentDeleteQuery,
  AgentGetListQuery,
  AgentGetOneQuery,
  AgentGetReferalLinkQuery,
  AgentGetReferalsQuery,
  AgentRegisterBody,
  AgentRegisterQuery,
  AgentTerminateQuery,
  AgentUpdateBody,
  AgentUpdateQuery,
} from './dto';
import { randomUUID } from 'crypto';
import { hash } from '../../utils/hash';
import { env } from '../../utils/env';

export enum AgentServiceError {
  AGENT_ALREADY_REGISTERED = 'AGENT_ALREADY_REGISTERED',
  AGENT_NOT_FOUND = 'AGENT_NOT_FOUND',
}

@Injectable()
export class AgentService {
  private Agent: Model<AgentDocument>;

  constructor(@InjectConnection() private db: Connection) {
    this.Agent = this.db.model(AGENT_COLLECTION, AgentSchema);
  }

  async getList(query: AgentGetListQuery) {
    const attributes = [
      'name',
      'surname',
      'lastname',
      'referalId',
      'comingFrom',
      'referals',
      'email',
      'phone',
      'employed',
      'terminated',
      'terminatedBy',
    ];

    let options = {};
    if (query.comingFrom)
      options = { ...options, comingFrom: query.comingFrom };
    if (query.terminated) options = { ...options, terminated: { $ne: null } };

    return this.Agent.find(options, attributes);
  }

  async getReferals(query: AgentGetReferalsQuery) {
    const agent = await this.Agent.findOne(query).select('referals');

    if (!agent) throw AgentServiceError.AGENT_NOT_FOUND;

    return { referalIds: agent.referals, count: agent.referals.length };
  }

  async getReferalLink(query: AgentGetReferalLinkQuery) {
    const agent = await this.Agent.findOne(query).select('referalId');

    if (!agent) throw AgentServiceError.AGENT_NOT_FOUND;

    return `${env.APP_DOMAIN}/register.php?referalId=${agent.referalId}`;
  }

  async getOne(query: AgentGetOneQuery) {
    const agent = await this.Agent.findOne(query).select('-password');

    if (!agent) throw AgentServiceError.AGENT_NOT_FOUND;

    return agent;
  }

  async register(query: AgentRegisterQuery, body: AgentRegisterBody) {
    const agent = await this.Agent.findOne({ phone: body.phone }).catch(
      this.errorHandler,
    );
    let referal;

    if (query.from) {
      referal = await this.Agent.findOne({ referalId: query.from }).catch(
        this.errorHandler,
      );
      if (!referal) throw AgentServiceError.AGENT_NOT_FOUND;
    }

    if (agent) throw AgentServiceError.AGENT_ALREADY_REGISTERED;

    const creation = {
      name: body.name,
      surname: body.surname,
      lastname: body.lastname ? body.lastname : null,
      referalId: randomUUID({ disableEntropyCache: true }),
      referals: [],
      percent: body.percent ? body.percent : 80,
      comingFrom: query.from ? query.from : null,
      email: body.email,
      phone: body.phone,
      password: hash(body.password),
      employed: new Date().toISOString(),
      terminated: null,
      terminatedBy: null,
    };

    const newAgent: any = await this.Agent.create(creation);

    if (referal) {
      await referal
        .updateOne({ $addToSet: { referals: newAgent._id.toString() } })
        .catch(this.errorHandler);
    }

    delete newAgent._doc.password;
    return newAgent;
  }

  async update(query: AgentUpdateQuery, body: AgentUpdateBody) {
    const agent = await this.Agent.findOne(query);

    if (!agent) throw AgentServiceError.AGENT_NOT_FOUND;
    let options = {};

    if (body.name) options = { ...options, name: body.name };
    if (body.surname) options = { ...options, surname: body.surname };
    if (body.lastname) options = { ...options, lastname: body.lastname };
    if (body.email) options = { ...options, email: body.email };
    if (body.phone) options = { ...options, phone: body.phone };
    if (body.password) options = { ...options, password: hash(body.password) };
    if (body.percent) options = { ...options, percent: body.percent };

    await agent.updateOne(options);

    return this.Agent.findOne(query).select('-password');
  }

  async terminate(query: AgentTerminateQuery) {
    const agent = await this.Agent.findOne({ _id: query._id });
    const executioner = await await this.Agent.findOne({
      _id: query.terminatedBy,
    });
    if (!agent) throw AgentServiceError.AGENT_NOT_FOUND;
    if (!executioner) throw AgentServiceError.AGENT_NOT_FOUND;

    await agent.updateOne({
      terminated: new Date().toISOString(),
      terminatedBy: executioner._id,
    });

    return await this.Agent.findOne({ _id: query._id });
  }

  async delete(query: AgentDeleteQuery) {
    const agent = await this.Agent.findOne(query);

    if (!agent) throw AgentServiceError.AGENT_NOT_FOUND;

    if (agent.comingFrom) {
      const referal = await this.Agent.findOne({
        referalId: agent.comingFrom,
      }).catch(this.errorHandler);

      if (!referal) throw AgentServiceError.AGENT_NOT_FOUND;

      await referal.updateOne({ $pull: { referals: agent._id.toString() } });
    }

    await agent.deleteOne();

    return { result: 'OK' };
  }

  private errorHandler(error) {
    console.log(error);
    throw error;
  }
}
