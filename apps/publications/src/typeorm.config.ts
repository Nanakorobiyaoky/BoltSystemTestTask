import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as process from 'process';

config({ path: `./.production.env` });

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_PUBLICATIONS_HOST,
  port: +process.env.MYSQL_PUBLICATIONS_PORT,
  username: process.env.MYSQL_PUBLICATIONS_USERNAME,
  password: process.env.MYSQL_PUBLICATIONS_PASSWORD,
  database: process.env.MYSQL_PUBLICATIONS_DATABASE,
  entities: ['*/**/publications/*.entity.ts'],
  migrations: ['./apps/publications/migrations/*.ts'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
