import type { Knex } from 'knex';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '1234',
      database: process.env.DB_NAME || 'spellnet'
    },
    migrations: {
      directory: path.resolve('./migrations'),
      extension: 'ts'
    },
    seeds: {
      directory: path.resolve('./seeds'),
      extension: 'ts'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};

export default config;
