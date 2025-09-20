import { getDb, initDatabase } from './index.js';
import { sql } from 'drizzle-orm';
import { logger } from '../utils/logger.js';

async function createMaintenanceTables() {
  try {
    logger.info('Creating maintenance tables...');

    await initDatabase();
    const db = getDb();

    // Create maintenance_types table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS maintenance_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type_code TEXT NOT NULL UNIQUE,
        type_name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        estimated_duration INTEGER,
        estimated_cost REAL,
        priority INTEGER NOT NULL DEFAULT 3,
        active INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `);

    // Create maintenance_schedules table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS maintenance_schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
        maintenance_type_id INTEGER NOT NULL REFERENCES maintenance_types(id),
        interval_type TEXT NOT NULL CHECK (interval_type IN ('kilometers', 'days', 'months', 'hours')),
        interval_value INTEGER NOT NULL,
        last_maintenance_date INTEGER,
        last_maintenance_km INTEGER,
        last_maintenance_hours INTEGER,
        next_maintenance_date INTEGER,
        next_maintenance_km INTEGER,
        next_maintenance_hours INTEGER,
        reminder_days_before INTEGER NOT NULL DEFAULT 7,
        reminder_km_before INTEGER NOT NULL DEFAULT 500,
        active INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `);

    // Create maintenance_work_orders table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS maintenance_work_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        work_order_number TEXT NOT NULL UNIQUE,
        vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
        maintenance_type_id INTEGER NOT NULL REFERENCES maintenance_types(id),
        maintenance_schedule_id INTEGER REFERENCES maintenance_schedules(id),
        title TEXT NOT NULL,
        description TEXT,
        priority INTEGER NOT NULL DEFAULT 3,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'in_progress', 'completed', 'cancelled', 'on_hold')),
        scheduled_date INTEGER,
        start_date INTEGER,
        completion_date INTEGER,
        estimated_duration INTEGER,
        actual_duration INTEGER,
        assigned_technician_id INTEGER,
        supplier_id INTEGER,
        odometer_reading_start INTEGER,
        odometer_reading_end INTEGER,
        engine_hours_start INTEGER,
        engine_hours_end INTEGER,
        estimated_cost REAL,
        labor_cost REAL,
        parts_cost REAL,
        external_cost REAL,
        total_cost REAL,
        currency TEXT NOT NULL DEFAULT 'USD',
        quality_check_passed INTEGER,
        quality_check_notes TEXT,
        warranty_period INTEGER,
        warranty_expiry_date INTEGER,
        notes TEXT,
        internal_notes TEXT,
        requested_by INTEGER NOT NULL,
        approved_by INTEGER,
        approved_at INTEGER,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `);

    // Create maintenance_parts table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS maintenance_parts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        work_order_id INTEGER NOT NULL REFERENCES maintenance_work_orders(id),
        part_number TEXT NOT NULL,
        part_name TEXT NOT NULL,
        part_category TEXT,
        quantity_used REAL NOT NULL,
        unit_of_measure TEXT NOT NULL DEFAULT 'each',
        unit_cost REAL NOT NULL,
        total_cost REAL NOT NULL,
        currency TEXT NOT NULL DEFAULT 'USD',
        supplier_id INTEGER,
        supplier_part_number TEXT,
        manufacturer TEXT,
        warranty_period INTEGER,
        batch_number TEXT,
        serial_number TEXT,
        notes TEXT,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `);

    // Create maintenance_labor table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS maintenance_labor (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        work_order_id INTEGER NOT NULL REFERENCES maintenance_work_orders(id),
        technician_id INTEGER,
        technician_name TEXT NOT NULL,
        start_time INTEGER NOT NULL,
        end_time INTEGER,
        break_duration INTEGER NOT NULL DEFAULT 0,
        total_hours REAL,
        hourly_rate REAL NOT NULL,
        total_cost REAL,
        currency TEXT NOT NULL DEFAULT 'USD',
        work_description TEXT,
        notes TEXT,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `);

    // Create maintenance_history table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS maintenance_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
        work_order_id INTEGER NOT NULL REFERENCES maintenance_work_orders(id),
        maintenance_type_id INTEGER NOT NULL REFERENCES maintenance_types(id),
        maintenance_date INTEGER NOT NULL,
        odometer_reading INTEGER,
        engine_hours INTEGER,
        work_performed TEXT NOT NULL,
        parts_replaced TEXT,
        issues TEXT,
        recommendations TEXT,
        fuel_efficiency_before REAL,
        fuel_efficiency_after REAL,
        performance_notes TEXT,
        total_cost REAL NOT NULL,
        labor_cost REAL,
        parts_cost REAL,
        external_cost REAL,
        currency TEXT NOT NULL DEFAULT 'USD',
        duration INTEGER,
        downtime INTEGER,
        quality_rating INTEGER,
        warranty_period INTEGER,
        warranty_expiry_date INTEGER,
        performed_by TEXT,
        supervised_by TEXT,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `);

    // Create maintenance_alerts table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS maintenance_alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
        maintenance_schedule_id INTEGER REFERENCES maintenance_schedules(id),
        alert_type TEXT NOT NULL CHECK (alert_type IN ('due', 'overdue', 'upcoming', 'critical')),
        alert_title TEXT NOT NULL,
        alert_message TEXT NOT NULL,
        priority INTEGER NOT NULL DEFAULT 3,
        due_date INTEGER,
        due_kilometers INTEGER,
        due_hours INTEGER,
        days_past_due INTEGER,
        kilometers_past_due INTEGER,
        acknowledged INTEGER NOT NULL DEFAULT 0,
        acknowledged_by INTEGER,
        acknowledged_at INTEGER,
        resolved INTEGER NOT NULL DEFAULT 0,
        resolved_at INTEGER,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `);

    // Create inspection_checklists table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS inspection_checklists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        checklist_name TEXT NOT NULL,
        checklist_type TEXT NOT NULL CHECK (checklist_type IN ('daily', 'weekly', 'monthly', 'pre_trip', 'post_trip')),
        vehicle_type_id INTEGER,
        checklist_items TEXT NOT NULL,
        required INTEGER NOT NULL DEFAULT 0,
        frequency INTEGER,
        active INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `);

    // Create vehicle_inspections table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS vehicle_inspections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        inspection_number TEXT NOT NULL UNIQUE,
        vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
        checklist_id INTEGER NOT NULL REFERENCES inspection_checklists(id),
        driver_id INTEGER,
        inspection_date INTEGER NOT NULL,
        inspection_type TEXT NOT NULL,
        odometer_reading INTEGER,
        engine_hours INTEGER,
        fuel_level REAL,
        overall_status TEXT NOT NULL CHECK (overall_status IN ('pass', 'fail', 'conditional')),
        checklist_results TEXT NOT NULL,
        issues_found TEXT,
        recommendations TEXT,
        next_inspection_due INTEGER,
        inspected_by TEXT NOT NULL,
        supervised_by TEXT,
        follow_up_required INTEGER NOT NULL DEFAULT 0,
        follow_up_notes TEXT,
        follow_up_completed INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `);

    logger.info('Maintenance tables created successfully');

  } catch (error) {
    logger.error('Error creating maintenance tables:', error);
    throw error;
  }
}

// Run the script if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createMaintenanceTables()
    .then(() => {
      logger.info('Tables creation completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Tables creation failed:', error);
      process.exit(1);
    });
}

export { createMaintenanceTables };