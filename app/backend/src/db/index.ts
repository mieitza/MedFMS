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

    // Seed document categories if they don't exist
    await seedDocumentCategories();

    logger.info('Database connection established');
    return db;
  } catch (error) {
    logger.error('Failed to initialize database:', error);
    throw error;
  }
}

async function seedDocumentCategories() {
  try {
    const { documentCategories } = await import('./schema/documents.js');
    const { eq } = await import('drizzle-orm');

    const categories = [
      { categoryName: 'Registration', description: 'Vehicle registration documents' },
      { categoryName: 'Insurance', description: 'Insurance policies and claims' },
      { categoryName: 'Maintenance', description: 'Service records and maintenance documentation' },
      { categoryName: 'Inspection', description: 'Safety and technical inspections' },
      { categoryName: 'License', description: 'Driver licenses and certifications' },
      { categoryName: 'Permits', description: 'Special permits and authorizations' },
      { categoryName: 'Contracts', description: 'Purchase, lease, and service contracts' },
      { categoryName: 'Other', description: 'Miscellaneous documents' }
    ];

    for (const category of categories) {
      const existing = await db.select()
        .from(documentCategories)
        .where(eq(documentCategories.categoryName, category.categoryName))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(documentCategories).values(category);
        logger.info(`Added document category: ${category.categoryName}`);
      }
    }
  } catch (error) {
    logger.error('Error seeding document categories:', error);
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export { db };