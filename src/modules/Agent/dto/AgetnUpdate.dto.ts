import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AgentUpdateQuery {
  @IsString()
  _id: string;
}

export class AgentUpdateBody {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  surname: string;

  @IsString()
  @IsOptional()
  lastname: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsNumber()
  @IsOptional()
  percent: number;
}
