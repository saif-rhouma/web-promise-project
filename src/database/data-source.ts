import { DataSource } from 'typeorm';
import { join } from 'path';

import environment from '../configs/environment';
//! MODELS IMPORT START
import { User } from '../core/models/user.model';
import { StartupProfile } from '../core/models/startup-profile.model';
import { JobPost } from '../core/models/job-post.model';
import { Application } from '../core/models/application.model';
//! MODELS IMPORT END

const migrationsPath = join(__dirname, '..', 'database/migrations/**/*.ts');

const AppDataSource = new DataSource({
  type: environment.DB_TYPE,
  host: environment.DB_HOST,
  port: environment.DB_PORT,
  database: environment.DB_NAME,
  username: environment.DB_USER,
  password: environment.DB_PASSWORD,
  synchronize: environment.isDev,
  logging: false,
  entities: [User, StartupProfile, JobPost, Application],
  migrationsTableName: 'migrations',
  migrations: [migrationsPath],
  subscribers: [],
});
export default AppDataSource;
