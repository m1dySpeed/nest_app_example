import { Body, Controller, Get, Headers, Post, Res } from '@nestjs/common';
import { AuthService } from './Auth.service';
import { AuthLogInBody } from './dto/AuthLogIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Get()
  async authCheck(@Headers('authorization') token: string) {
    return await this.service.authCheck(token);
  }

  @Post()
  async login(
    @Body() body: AuthLogInBody,
    @Res({ passthrough: true }) response,
  ) {
    return await this.service.login(body, response);
  }
}
