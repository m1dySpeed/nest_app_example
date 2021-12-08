import { IsString } from 'class-validator';

export class AgentDeleteQuery {
  @IsString()
  _id: string;
}
