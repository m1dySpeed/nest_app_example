import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class AgentRegisterQuery {
  @IsUUID()
  @IsOptional()
  from: string;
}

export class AgentRegisterBody {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  @IsOptional()
  lastname: string;

  @IsNumber()
  @IsOptional()
  percent: number;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  password: string;
}
