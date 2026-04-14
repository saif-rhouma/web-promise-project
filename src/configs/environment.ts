import { cleanEnv, host, port, str } from 'envalid';

const environment = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  PORT: port(),
  DB_TYPE: str({ choices: ['mysql', 'sqlite', 'better-sqlite3'] }),
  DB_HOST: host(),
  DB_PORT: port(),
  DB_NAME: str(),
  DB_USER: str(),
  DB_PASSWORD: str(),
  ACCESS_TOKEN_SECRET: str(),
  REFRESH_TOKEN_SECRET: str(),
});

export default environment;
