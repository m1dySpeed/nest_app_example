import { IsString } from 'class-validator';

export class AuthLogInBody {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
