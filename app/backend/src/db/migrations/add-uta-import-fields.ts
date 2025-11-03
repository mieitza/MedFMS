import { Db } from '../index';

export async function up(db: Db) {
  console.log('Adding UTA fuel card import fields to fuel_transactions...');

  // Add UTA-specific fields to fuel_transactions table
  const migrations = [
    // Fuel card information
    `ALTER TABLE fuel_transactions ADD COLUMN fuel_card_id INTEGER REFERENCES fuel_cards(id)`,
    `ALTER TABLE fuel_transactions ADD COLUMN card_number TEXT`,

    // Cost center tracking for departmental analysis
    `ALTER TABLE fuel_transactions ADD COLUMN cost_center1 TEXT`,
    `ALTER TABLE fuel_transactions ADD COLUMN cost_center2 TEXT`,

    // Location details for better geographic analysis
    `ALTER TABLE fuel_transactions ADD COLUMN country TEXT`,
    `ALTER TABLE fuel_transactions ADD COLUMN postal_code TEXT`,
    `ALTER TABLE fuel_transactions ADD COLUMN station_external_id TEXT`,

    // VAT and currency details for international operations
    `ALTER TABLE fuel_transactions ADD COLUMN vat_rate REAL`,
    `ALTER TABLE fuel_transactions ADD COLUMN vat_amount REAL`,
    `ALTER TABLE fuel_transactions ADD COLUMN amount_excl_vat REAL`,
    `ALTER TABLE fuel_transactions ADD COLUMN currency TEXT DEFAULT 'RON'`,

    // External reference tracking
    `ALTER TABLE fuel_transactions ADD COLUMN voucher_number TEXT`,
    `ALTER TABLE fuel_transactions ADD COLUMN external_reference TEXT`,
    `ALTER TABLE fuel_transactions ADD COLUMN import_batch_id TEXT`,

    // Delivery information separate from invoice
    `ALTER TABLE fuel_transactions ADD COLUMN delivery_date INTEGER`,
    `ALTER TABLE fuel_transactions ADD COLUMN delivery_time TEXT`,
    `ALTER TABLE fuel_transactions ADD COLUMN invoice_date INTEGER`,

    // Product categorization for detailed analysis
    `ALTER TABLE fuel_transactions ADD COLUMN product_name TEXT`,
    `ALTER TABLE fuel_transactions ADD COLUMN product_category TEXT`,

    // Additional notes for import tracking
    `ALTER TABLE fuel_transactions ADD COLUMN import_source TEXT`,
    `ALTER TABLE fuel_transactions ADD COLUMN import_notes TEXT`,
  ];

  for (const migration of migrations) {
    try {
      await db.run(migration);
      console.log(`✓ Executed: ${migration.substring(0, 60)}...`);
    } catch (error: any) {
      // Column might already exist, ignore duplicate column errors
      if (!error.message.includes('duplicate column name')) {
        console.error(`✗ Failed: ${migration}`);
        throw error;
      } else {
        console.log(`⊘ Skipped (already exists): ${migration.substring(0, 60)}...`);
      }
    }
  }

  // Create index on card_number for faster lookup
  try {
    await db.run(`CREATE INDEX IF NOT EXISTS idx_fuel_transactions_card_number ON fuel_transactions(card_number)`);
    console.log('✓ Created index on card_number');
  } catch (error) {
    console.error('✗ Failed to create index on card_number:', error);
  }

  // Create index on voucher_number for faster lookup
  try {
    await db.run(`CREATE INDEX IF NOT EXISTS idx_fuel_transactions_voucher_number ON fuel_transactions(voucher_number)`);
    console.log('✓ Created index on voucher_number');
  } catch (error) {
    console.error('✗ Failed to create index on voucher_number:', error);
  }

  // Create index on import_batch_id for batch operations
  try {
    await db.run(`CREATE INDEX IF NOT EXISTS idx_fuel_transactions_import_batch ON fuel_transactions(import_batch_id)`);
    console.log('✓ Created index on import_batch_id');
  } catch (error) {
    console.error('✗ Failed to create index on import_batch_id:', error);
  }

  // Create index on station_external_id for station matching
  try {
    await db.run(`CREATE INDEX IF NOT EXISTS idx_fuel_transactions_station_external ON fuel_transactions(station_external_id)`);
    console.log('✓ Created index on station_external_id');
  } catch (error) {
    console.error('✗ Failed to create index on station_external_id:', error);
  }

  console.log('✅ UTA import fields migration completed successfully!');
}

export async function down(db: Db) {
  console.log('Reverting UTA fuel card import fields...');

  // SQLite doesn't support DROP COLUMN directly, so we'd need to recreate the table
  // For safety, we'll just log a warning
  console.warn('⚠️  SQLite does not support DROP COLUMN. Manual intervention required to revert this migration.');
  console.warn('⚠️  The added columns will remain in the database but won\'t be used.');
}
