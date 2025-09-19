import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { logger } from '../utils/logger.js';
import * as schema from './schema/index.js';

let db: ReturnType<typeof drizzle>;

export async function initDatabase() {
  try {
    const databasePath = process.env.DATABASE_PATH || './data/medfms.db';
    const sqlite = new Database(databasePath);

    // Enable foreign keys
    sqlite.pragma('foreign_keys = ON');

    // Set journal mode to WAL for better concurrency
    sqlite.pragma('journal_mode = WAL');

    db = drizzle(sqlite, { schema });

    logger.info('Database connection established');
    return db;
  } catch (error) {
    logger.error('Failed to initialize database:', error);
    throw error;
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export { db };