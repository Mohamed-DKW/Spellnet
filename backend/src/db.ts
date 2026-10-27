import knex from 'knex';
import config from '../knexfile';
import { Model } from 'objection';

const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment]);

Model.knex(db);

export default db;