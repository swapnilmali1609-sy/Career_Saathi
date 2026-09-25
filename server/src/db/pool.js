import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

let pool = null;

// Determine if SSL is required (e.g. for cloud providers like Neon, Supabase, Render, Railway)
const isProduction = process.env.NODE_ENV === 'production';
const requiresSsl = databaseUrl && (
  databaseUrl.includes('sslmode=require') ||
  databaseUrl.includes('.render.com') ||
  databaseUrl.includes('.supabase.co') ||
  databaseUrl.includes('.neon.tech') ||
  databaseUrl.includes('.railway.app') ||
  databaseUrl.includes('amazonaws.com') ||
  isProduction
);

if (databaseUrl) {
  try {
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: requiresSsl ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    });

    pool.on('error', (err) => {
      console.error('[PostgreSQL Pool Unexpected Error]:', err.message);
    });
  } catch (err) {
    console.error('[PostgreSQL Pool Initialization Failed]:', err.message);
    pool = null;
  }
}

/**
 * Check if a PostgreSQL database URL is configured
 */
export function isPgConfigured() {
  return Boolean(pool);
}

/**
 * Execute a query with parameterized inputs
 */
export async function query(text, params) {
  if (!pool) {
    throw new Error('PostgreSQL connection pool is not configured.');
  }
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.DEBUG_SQL === 'true') {
    console.log('[SQL]', { text: text.trim().replace(/\s+/g, ' '), duration: `${duration}ms`, rows: res.rowCount });
  }
  return res;
}

/**
 * Test PostgreSQL connectivity
 */
export async function testConnection() {
  if (!pool) {
    return { success: false, reason: 'DATABASE_URL environment variable is not configured.' };
  }
  try {
    const res = await pool.query('SELECT NOW() as now, current_database() as db;');
    return {
      success: true,
      timestamp: res.rows[0]?.now,
      database: res.rows[0]?.db
    };
  } catch (err) {
    return {
      success: false,
      reason: err.message
    };
  }
}

/**
 * Get the raw pg Pool instance
 */
export function getPool() {
  return pool;
}

export default {
  query,
  testConnection,
  isPgConfigured,
  getPool
};
