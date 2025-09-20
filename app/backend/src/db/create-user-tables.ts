import { getDb, initDatabase } from './index.js';
import { sql } from 'drizzle-orm';
import { logger } from '../utils/logger.js';
import bcrypt from 'bcrypt';
import { users } from './schema/users.js';

async function createUserTables() {
  try {
    logger.info('Creating user tables...');

    await initDatabase();
    const db = getDb();

    // Create users table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        pin TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        department_id INTEGER,
        location_id INTEGER,
        phone_number TEXT,
        active INTEGER NOT NULL DEFAULT 1,
        last_login INTEGER,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `);

    // Create sessions table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        token TEXT NOT NULL UNIQUE,
        expires_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `);

    // Create demo user: admin/1234
    const hashedPin = await bcrypt.hash('1234', 10);

    try {
      await db.insert(users).values({
        username: 'admin',
        email: 'admin@medfms.com',
        pin: hashedPin,
        fullName: 'System Administrator',
        role: 'admin'
      });
      logger.info('Demo user created: admin/1234');
    } catch (error) {
      // User might already exist
      logger.info('Demo user already exists or error creating user:', error);
    }

    logger.info('User tables created successfully');

  } catch (error) {
    logger.error('Error creating user tables:', error);
    throw error;
  }
}

// Run the script if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createUserTables()
    .then(() => {
      logger.info('User tables creation completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('User tables creation failed:', error);
      process.exit(1);
    });
}

export { createUserTables };