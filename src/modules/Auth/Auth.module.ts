import { Module } from '@nestjs/common';
import { AuthController } from './Auth.controller';
import { AuthService } from './Auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
