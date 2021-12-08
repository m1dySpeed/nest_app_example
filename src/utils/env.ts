import { cleanEnv, port, str } from 'envalid';
import { config as dotenv } from 'dotenv';

const { parsed } = dotenv();

const validators = {
  APP_HOST: str(),
  APP_PORT: port(),
  APP_MODE: str(),
  APP_DOMAIN: str(),

  JWT_SECRET: str(),

  DB_PORT: port(),
  DB_HOST: str(),
  DB_NAME: str(),
  DB_USER: str(),
  DB_PSWD: str(),

  ROOT_USER: str(),
  ROOT_PSWD: str(),
};

export const env = cleanEnv(parsed, validators);
