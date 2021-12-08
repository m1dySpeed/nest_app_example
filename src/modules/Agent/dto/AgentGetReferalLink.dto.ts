import { IsString } from 'class-validator';

export class AgentGetReferalLinkQuery {
  @IsString()
  _id: string;
}
