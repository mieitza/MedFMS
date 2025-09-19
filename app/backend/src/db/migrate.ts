import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { logger } from '../utils/logger.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '../../../../.env') });

async function runMigrations() {
  try {
    const databasePath = process.env.DATABASE_PATH || './data/medfms.db';

    // Ensure data directory exists
    const fs = await import('fs');
    const path = await import('path');
    const dataDir = path.dirname(databasePath);

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const sqlite = new Database(databasePath);
    const db = drizzle(sqlite);

    logger.info('Running database migrations...');

    migrate(db, { migrationsFolder: './src/db/migrations' });

    logger.info('Migrations completed successfully');
    sqlite.close();
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();