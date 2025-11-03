import Database from 'better-sqlite3';
import { logger } from '../utils/logger.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runUtaMigration() {
  try {
    const databasePath = process.env.DATABASE_PATH || join(__dirname, '../../data/medfms.db');
    logger.info(`Running UTA import fields migration on: ${databasePath}`);

    const db = new Database(databasePath);

    // Enable foreign keys
    db.pragma('foreign_keys = ON');

    console.log('\n🔄 Starting UTA fuel card import fields migration...\n');

    // Add UTA-specific fields to fuel_transactions table
    const migrations = [
      // Fuel card information
      { sql: `ALTER TABLE fuel_transactions ADD COLUMN fuel_card_id INTEGER REFERENCES fuel_cards(id)`, desc: 'Fuel card ID' },
      { sql: `ALTER TABLE fuel_transactions ADD COLUMN card_number TEXT`, desc: 'Card number' },

      // Cost center tracking
      { sql: `ALTER TABLE fuel_transactions ADD COLUMN cost_center1 TEXT`, desc: 'Cost center 1' },
      { sql: `ALTER TABLE fuel_transactions ADD COLUMN cost_center2 TEXT`, desc: 'Cost center 2' },

      // Location details
      { sql: `ALTER TABLE fuel_transactions ADD COLUMN country TEXT`, desc: 'Country' },
      { sql: `ALTER TABLE fuel_transactions ADD COLUMN postal_code TEXT`, desc: 'Postal code' },
      { sql: `ALTER TABLE fuel_transactions ADD COLUMN station_external_id TEXT`, desc: 'Station external ID' },

      // VAT and currency
      { sql: `ALTER TABLE fuel_transactions ADD COLUMN vat_rate REAL`, desc: 'VAT rate' },
      { sql: `ALTER TABLE fuel_transactions ADD COLUMN vat_amount REAL`, desc: 'VAT amount' },
      { sql: `ALTER TABLE fuel_transactions ADD COLUMN amount_excl_vat REAL`, desc: 'Amount excl VAT' },
      { sql: `ALTER TABLE fuel_transactions ADD COLUMN currency TEXT DEFAULT 'RON'`, desc: 'Currency' },

      // External reference tracking
      { sql: `ALTER TABLE fuel_transactions ADD COLUMN voucher_number TEXT`, desc: 'Voucher number' },
      { sql: `ALTER TABLE fuel_transactions ADD COLUMN external_reference TEXT`, desc: 'External reference' },
      { sql: `ALTER TABLE fuel_transactions ADD COLUMN import_batch_id TEXT`, desc: 'Import batch ID' },

      // Delivery information
      { sql: `ALTER TABLE fuel_transactions ADD COLUMN delivery_date INTEGER`, desc: 'Delivery date' },
      { sql: `ALTER TABLE fuel_transactions ADD COLUMN delivery_time TEXT`, desc: 'Delivery time' },
      { sql: `ALTER TABLE fuel_transactions ADD COLUMN invoice_date INTEGER`, desc: 'Invoice date' },

      // Product categorization
      { sql: `ALTER TABLE fuel_transactions ADD COLUMN product_name TEXT`, desc: 'Product name' },
      { sql: `ALTER TABLE fuel_transactions ADD COLUMN product_category TEXT`, desc: 'Product category' },

      // Import tracking
      { sql: `ALTER TABLE fuel_transactions ADD COLUMN import_source TEXT`, desc: 'Import source' },
      { sql: `ALTER TABLE fuel_transactions ADD COLUMN import_notes TEXT`, desc: 'Import notes' },
    ];

    let successCount = 0;
    let skipCount = 0;

    for (const migration of migrations) {
      try {
        db.exec(migration.sql);
        console.log(`✅ Added column: ${migration.desc}`);
        successCount++;
      } catch (error: any) {
        if (error.message.includes('duplicate column name')) {
          console.log(`⏭️  Skipped (already exists): ${migration.desc}`);
          skipCount++;
        } else {
          console.error(`❌ Failed to add ${migration.desc}:`, error.message);
          throw error;
        }
      }
    }

    // Create indexes
    console.log('\n🔍 Creating indexes...\n');

    const indexes = [
      { sql: `CREATE INDEX IF NOT EXISTS idx_fuel_transactions_card_number ON fuel_transactions(card_number)`, desc: 'card_number index' },
      { sql: `CREATE INDEX IF NOT EXISTS idx_fuel_transactions_voucher_number ON fuel_transactions(voucher_number)`, desc: 'voucher_number index' },
      { sql: `CREATE INDEX IF NOT EXISTS idx_fuel_transactions_import_batch ON fuel_transactions(import_batch_id)`, desc: 'import_batch_id index' },
      { sql: `CREATE INDEX IF NOT EXISTS idx_fuel_transactions_station_external ON fuel_transactions(station_external_id)`, desc: 'station_external_id index' },
      { sql: `CREATE INDEX IF NOT EXISTS idx_fuel_transactions_delivery_date ON fuel_transactions(delivery_date)`, desc: 'delivery_date index' },
      { sql: `CREATE INDEX IF NOT EXISTS idx_fuel_transactions_country ON fuel_transactions(country)`, desc: 'country index' },
    ];

    for (const index of indexes) {
      try {
        db.exec(index.sql);
        console.log(`✅ Created: ${index.desc}`);
      } catch (error: any) {
        console.error(`❌ Failed to create ${index.desc}:`, error.message);
      }
    }

    db.close();

    console.log('\n' + '='.repeat(60));
    console.log(`✨ Migration completed successfully!`);
    console.log(`   - ${successCount} columns added`);
    console.log(`   - ${skipCount} columns skipped (already exist)`);
    console.log(`   - ${indexes.length} indexes created`);
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    logger.error('UTA migration failed:', error);
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
runUtaMigration();
