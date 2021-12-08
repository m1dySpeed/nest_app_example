import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AgentService, AgentServiceError } from './Agent.service';
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
import { AccessGuard } from '../Auth/AccessGuard';

@Controller('agent')
export class AgentController {
  constructor(private service: AgentService) {}
  @AccessGuard()
  @Get('list')
  async getList(@Query() query: AgentGetListQuery) {
    return await this.service.getList(query).catch(this.errorHandler);
  }

  @AccessGuard()
  @Get('ref')
  async getReferals(@Query() query: AgentGetReferalsQuery) {
    return await this.service.getReferals(query).catch(this.errorHandler);
  }

  @Get('link')
  async getReferalLink(@Query() query: AgentGetReferalLinkQuery) {
    return await this.service.getReferalLink(query).catch(this.errorHandler);
  }

  @AccessGuard()
  @Get()
  async getOne(@Query() query: AgentGetOneQuery) {
    return await this.service.getOne(query).catch(this.errorHandler);
  }

  @Post()
  async register(
    @Query() query: AgentRegisterQuery,
    @Body() body: AgentRegisterBody,
  ) {
    return await this.service.register(query, body).catch(this.errorHandler);
  }

  @Patch()
  async update(
    @Query() query: AgentUpdateQuery,
    @Body() body: AgentUpdateBody,
  ) {
    return await this.service.update(query, body).catch(this.errorHandler);
  }

  @AccessGuard()
  @Patch('terminate')
  async terminate(@Query() query: AgentTerminateQuery) {
    return await this.service.terminate(query).catch(this.errorHandler);
  }

  @AccessGuard()
  @Delete()
  async delete(@Query() query: AgentDeleteQuery) {
    return await this.service.delete(query).catch(this.errorHandler);
  }

  private errorHandler(error) {
    switch (error) {
      case AgentServiceError.AGENT_ALREADY_REGISTERED:
        throw new ConflictException(
          'Agent already registered',
          AgentServiceError.AGENT_ALREADY_REGISTERED,
        );
      case AgentServiceError.AGENT_NOT_FOUND:
        throw new NotFoundException(
          'Agent not found',
          AgentServiceError.AGENT_NOT_FOUND,
        );
    }
  }
}
