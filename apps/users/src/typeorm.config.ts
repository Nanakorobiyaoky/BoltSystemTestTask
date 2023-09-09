import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as process from 'process';

config({ path: `./.production.env` });

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_USERS_HOST,
  port: +process.env.MYSQL_USERS_PORT,
  username: process.env.MYSQL_USERS_USERNAME,
  password: process.env.MYSQL_USERS_PASSWORD,
  database: process.env.MYSQL_USERS_DATABASE,
  entities: ['*/**/users/*.entity.ts'],
  migrations: ['./apps/users/migrations/*.ts'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
