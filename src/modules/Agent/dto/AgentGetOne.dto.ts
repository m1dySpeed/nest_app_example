import { IsString } from 'class-validator';

export class AgentGetOneQuery {
  @IsString()
  _id: string;
}
