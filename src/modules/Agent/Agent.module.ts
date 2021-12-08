import { Module } from '@nestjs/common';
import { AgentController } from './Agent.controller';
import { AgentService } from './Agent.service';

@Module({ controllers: [AgentController], providers: [AgentService] })
export class AgentModule {}
