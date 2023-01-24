import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AgentDocument = Agent & Document;

export const AGENT_COLLECTION = 'agents';

@Schema({ collection: AGENT_COLLECTION, timestamps: true, autoCreate: true })
export class Agent {
  @Prop()
  name: string;

  @Prop()
  surname: string;

  @Prop()
  lastname: string;

  @Prop()
  referalId: string;

  @Prop()
  comingFrom: string;

  @Prop()
  referals: string[];

  @Prop({ default: () => 80 })
  percent: number;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  password: string;

  @Prop()
  employed: Date;

  @Prop({
    default: false,
  })
  terminated: boolean;

  @Prop()
  terminatedBy: string;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);
