import { IsString } from 'class-validator';

export class AgentTerminateQuery {
  @IsString()
  _id: string;

  @IsString()
  terminatedBy: string;
}
