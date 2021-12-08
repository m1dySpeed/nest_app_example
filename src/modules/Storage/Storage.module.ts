import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from '../../utils/env';

const dbUrl = `mongodb://${env.DB_USER}:${env.DB_PSWD}@${
  env.APP_MODE === 'dev' ? 'localhost' : env.DB_HOST
}:${env.DB_PORT}/${env.DB_NAME}?authSource=${
  env.APP_MODE === 'dev' ? 'admin' : env.DB_NAME
}`;

const mongooseRoot = MongooseModule.forRoot(dbUrl);

@Global()
@Module({
  imports: [mongooseRoot],
  exports: [mongooseRoot],
})
export class StorageModule {}
