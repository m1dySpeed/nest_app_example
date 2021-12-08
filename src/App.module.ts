import { Controller, Get, Module, OnModuleInit } from '@nestjs/common';
import { name, version } from 'package.json';
import { AgentModule } from './modules/Agent/Agent.module';
import { StorageModule } from './modules/Storage/Storage.module';
import { AuthModule } from './modules/Auth/Auth.module';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import {
  ROOT_COLLECTION,
  RootDocument,
  RootSchema,
} from './modules/Storage/shemas/Root.schema';
import { env } from './utils/env';
import { hash } from './utils/hash';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return { service: name, version: version, status: 'running' };
  }
}

@Module({
  imports: [AgentModule, StorageModule, AuthModule],
  controllers: [AppController],
})
export class AppModule implements OnModuleInit {
  private Root: Model<RootDocument>;
  constructor(@InjectConnection() private db: Connection) {
    this.Root = this.db.model(ROOT_COLLECTION, RootSchema);
  }
  async onModuleInit() {
    const root = await this.Root.findOne();
    if (!root)
      await this.Root.create({
        username: env.ROOT_USER,
        password: hash(env.ROOT_PSWD),
        role: 'root',
      });
    else return;
  }
}
