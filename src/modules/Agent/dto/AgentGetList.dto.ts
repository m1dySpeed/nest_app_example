import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class AgentGetListQuery {
  @IsString()
  @IsOptional()
  comingFrom: string;

  @IsBoolean()
  @Transform(({ obj }) =>
    Boolean(obj.terminated) ? obj.terminated === 'true' : obj.terminated,
  )
  @IsOptional()
  terminated: boolean;
}
