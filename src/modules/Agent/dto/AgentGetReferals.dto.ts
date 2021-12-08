import { IsString } from 'class-validator';

export class AgentGetReferalsQuery {
  @IsString()
  _id: string;
}
