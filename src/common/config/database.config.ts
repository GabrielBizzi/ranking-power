import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const DB_CONFIG: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/modules/*/entities/*.entity.js'],
  autoLoadEntities: true,
  synchronize: true,
  // logging: true,
  // logger: 'advanced-console'
};

export { DB_CONFIG };
