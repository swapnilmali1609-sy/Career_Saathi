import pool, { query, testConnection, isPgConfigured } from './pool.js';
import initDb from './initDb.js';
import db from './dbRepository.js';

export {
  pool,
  query,
  testConnection,
  isPgConfigured,
  initDb,
  db
};

export default db;
