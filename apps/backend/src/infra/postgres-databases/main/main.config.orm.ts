import { DataSourceOptions } from 'typeorm';
import { buildAppConfig } from '../../../config/config';

const entityGlobs = [
  __dirname + '/entities/**/*.entity.{ts,js}',
  __dirname + '/entities/**/*.pivot.entity.{ts,js}',
];

const { database } = buildAppConfig();

/** Main DB only (public schema). All entities (main + pivot) loaded from globs. */
export const mainConfig: DataSourceOptions = {
  type: 'postgres',
  host: database.host,
  port: database.port,
  username: String(database.username),
  password: database.password,
  database: String(database.name),
  entities: entityGlobs,
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
};
