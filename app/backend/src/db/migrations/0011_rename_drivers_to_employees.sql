-- Migration: Rename drivers to employees across the platform
-- This migration renames the drivers table and all related columns/references

PRAGMA foreign_keys=OFF;

-- ================================================
-- 1. RENAME drivers TABLE TO employees
-- ================================================

-- First, rename the table
ALTER TABLE drivers RENAME TO employees;

-- Now recreate the table with renamed column (driver_code -> employee_code)
CREATE TABLE employees_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_code TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  id_number TEXT UNIQUE,
  license_number TEXT NOT NULL UNIQUE,
  license_type TEXT NOT NULL,
  license_expiry_date INTEGER,
  phone_number TEXT,
  mobile_number TEXT,
  email TEXT,
  address TEXT,
  city_id INTEGER,
  date_of_birth INTEGER,
  hire_date INTEGER,
  termination_date INTEGER,
  department_id INTEGER,
  position_id INTEGER,
  emergency_contact TEXT,
  emergency_phone TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- Copy data from employees (renamed from drivers) to employees_new
INSERT INTO employees_new (id, employee_code, first_name, last_name, full_name, id_number, license_number, license_type, license_expiry_date, phone_number, mobile_number, email, address, city_id, date_of_birth, hire_date, termination_date, department_id, position_id, emergency_contact, emergency_phone, active, created_at, updated_at)
SELECT id, driver_code, first_name, last_name, full_name, id_number, license_number, license_type, license_expiry_date, phone_number, mobile_number, email, address, city_id, date_of_birth, hire_date, termination_date, department_id, position_id, emergency_contact, emergency_phone, active, created_at, updated_at FROM employees;

-- Drop old table and rename new
DROP TABLE employees;
ALTER TABLE employees_new RENAME TO employees;

-- ================================================
-- 2. RENAME driver_id TO employee_id IN vehicles TABLE
-- ================================================

CREATE TABLE vehicles_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_code TEXT NOT NULL UNIQUE,
  license_plate TEXT NOT NULL UNIQUE,
  brand_id INTEGER NOT NULL,
  model_id INTEGER NOT NULL,
  year INTEGER,
  fuel_type_id INTEGER NOT NULL,
  vehicle_type_id INTEGER NOT NULL,
  status_id INTEGER NOT NULL,
  location_id INTEGER,
  department_id INTEGER,
  employee_id INTEGER,
  registration_date INTEGER,
  acquisition_date INTEGER,
  purchase_price REAL,
  current_value REAL,
  odometer INTEGER NOT NULL DEFAULT 0,
  engine_number TEXT,
  chassis_number TEXT,
  description TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  custom_field_1 TEXT,
  custom_field_2 TEXT,
  custom_field_3 TEXT,
  custom_field_4 TEXT,
  custom_field_5 TEXT,
  custom_field_6 TEXT,
  custom_field_7 TEXT,
  custom_field_8 TEXT,
  custom_field_9 REAL,
  custom_field_10 REAL,
  custom_field_11 TEXT,
  custom_field_12 TEXT,
  anmdm_auth_number TEXT,
  anmdm_auth_type TEXT,
  anmdm_issue_date INTEGER,
  anmdm_expiry_date INTEGER,
  anmdm_issuing_authority TEXT,
  anmdm_notes TEXT,
  anmdm_document_path TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

INSERT INTO vehicles_new (id, vehicle_code, license_plate, brand_id, model_id, year, fuel_type_id, vehicle_type_id, status_id, location_id, department_id, employee_id, registration_date, acquisition_date, purchase_price, current_value, odometer, engine_number, chassis_number, description, active, custom_field_1, custom_field_2, custom_field_3, custom_field_4, custom_field_5, custom_field_6, custom_field_7, custom_field_8, custom_field_9, custom_field_10, custom_field_11, custom_field_12, anmdm_auth_number, anmdm_auth_type, anmdm_issue_date, anmdm_expiry_date, anmdm_issuing_authority, anmdm_notes, anmdm_document_path, created_at, updated_at)
SELECT id, vehicle_code, license_plate, brand_id, model_id, year, fuel_type_id, vehicle_type_id, status_id, location_id, department_id, driver_id, registration_date, acquisition_date, purchase_price, current_value, odometer, engine_number, chassis_number, description, active, custom_field_1, custom_field_2, custom_field_3, custom_field_4, custom_field_5, custom_field_6, custom_field_7, custom_field_8, custom_field_9, custom_field_10, custom_field_11, custom_field_12, anmdm_auth_number, anmdm_auth_type, anmdm_issue_date, anmdm_expiry_date, anmdm_issuing_authority, anmdm_notes, anmdm_document_path, created_at, updated_at FROM vehicles;

DROP TABLE vehicles;
ALTER TABLE vehicles_new RENAME TO vehicles;

-- ================================================
-- 3. RENAME driver_id TO employee_id IN fuel_transactions TABLE
-- ================================================

CREATE TABLE fuel_transactions_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_type TEXT NOT NULL,
  vehicle_id INTEGER NOT NULL,
  employee_id INTEGER,
  fuel_type_id INTEGER NOT NULL,
  location_id INTEGER,
  supplier_id INTEGER,
  transaction_date INTEGER NOT NULL,
  quantity REAL NOT NULL,
  price_per_unit REAL NOT NULL,
  total_amount REAL NOT NULL,
  odometer INTEGER,
  invoice_number TEXT,
  description TEXT,
  approved INTEGER NOT NULL DEFAULT 0,
  approved_by INTEGER,
  approval_date INTEGER,
  card_number TEXT,
  cost_center1 TEXT,
  cost_center2 TEXT,
  country TEXT,
  postal_code TEXT,
  station_external_id TEXT,
  vat_rate REAL,
  vat_amount REAL,
  amount_excl_vat REAL,
  currency TEXT DEFAULT 'RON',
  voucher_number TEXT,
  external_reference TEXT,
  import_batch_id TEXT,
  delivery_date INTEGER,
  delivery_time TEXT,
  invoice_date INTEGER,
  product_name TEXT,
  product_category TEXT,
  import_source TEXT,
  import_notes TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

INSERT INTO fuel_transactions_new (id, transaction_type, vehicle_id, employee_id, fuel_type_id, location_id, supplier_id, transaction_date, quantity, price_per_unit, total_amount, odometer, invoice_number, description, approved, approved_by, approval_date, card_number, cost_center1, cost_center2, country, postal_code, station_external_id, vat_rate, vat_amount, amount_excl_vat, currency, voucher_number, external_reference, import_batch_id, delivery_date, delivery_time, invoice_date, product_name, product_category, import_source, import_notes, created_at)
SELECT id, transaction_type, vehicle_id, driver_id, fuel_type_id, location_id, supplier_id, transaction_date, quantity, price_per_unit, total_amount, odometer, invoice_number, description, approved, approved_by, approval_date, card_number, cost_center1, cost_center2, country, postal_code, station_external_id, vat_rate, vat_amount, amount_excl_vat, currency, voucher_number, external_reference, import_batch_id, delivery_date, delivery_time, invoice_date, product_name, product_category, import_source, import_notes, created_at FROM fuel_transactions;

DROP TABLE fuel_transactions;
ALTER TABLE fuel_transactions_new RENAME TO fuel_transactions;

-- ================================================
-- 4. RENAME driver_id TO employee_id IN fuel_cards TABLE
-- ================================================

CREATE TABLE fuel_cards_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_number TEXT NOT NULL UNIQUE,
  card_provider TEXT NOT NULL,
  vehicle_id INTEGER,
  employee_id INTEGER,
  expiry_date INTEGER,
  credit_limit REAL,
  current_balance REAL NOT NULL DEFAULT 0,
  daily_limit REAL,
  weekly_limit REAL,
  monthly_limit REAL,
  allowed_fuel_types TEXT,
  allowed_stations TEXT,
  pin_code TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  blocked INTEGER NOT NULL DEFAULT 0,
  block_reason TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

INSERT INTO fuel_cards_new (id, card_number, card_provider, vehicle_id, employee_id, expiry_date, credit_limit, current_balance, daily_limit, weekly_limit, monthly_limit, allowed_fuel_types, allowed_stations, pin_code, active, blocked, block_reason, created_at, updated_at)
SELECT id, card_number, card_provider, vehicle_id, driver_id, expiry_date, credit_limit, current_balance, daily_limit, weekly_limit, monthly_limit, allowed_fuel_types, allowed_stations, pin_code, active, blocked, block_reason, created_at, updated_at FROM fuel_cards;

DROP TABLE fuel_cards;
ALTER TABLE fuel_cards_new RENAME TO fuel_cards;

-- ================================================
-- 5. RENAME driver_id TO employee_id IN accident_records TABLE
-- ================================================

CREATE TABLE accident_records_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id INTEGER NOT NULL,
  employee_id INTEGER,
  accident_date INTEGER NOT NULL,
  location TEXT,
  description TEXT,
  severity TEXT,
  fault_percentage INTEGER,
  police_report_number TEXT,
  insurance_claim_number TEXT,
  estimated_cost REAL,
  actual_cost REAL,
  status TEXT NOT NULL DEFAULT 'reported',
  notes TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

INSERT INTO accident_records_new (id, vehicle_id, employee_id, accident_date, location, description, severity, fault_percentage, police_report_number, insurance_claim_number, estimated_cost, actual_cost, status, notes, active, created_at, updated_at)
SELECT id, vehicle_id, driver_id, accident_date, location, description, severity, fault_percentage, police_report_number, insurance_claim_number, estimated_cost, actual_cost, status, notes, active, created_at, updated_at FROM accident_records;

DROP TABLE accident_records;
ALTER TABLE accident_records_new RENAME TO accident_records;

-- ================================================
-- 6. RENAME driver_id TO employee_id IN penalty_records TABLE
-- ================================================

CREATE TABLE penalty_records_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id INTEGER NOT NULL,
  employee_id INTEGER,
  penalty_definition_id INTEGER,
  violation_date INTEGER NOT NULL,
  violation_location TEXT,
  fine_amount REAL NOT NULL,
  paid_amount REAL DEFAULT 0,
  payment_date INTEGER,
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  due_date INTEGER,
  reference_number TEXT,
  notes TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

INSERT INTO penalty_records_new (id, vehicle_id, employee_id, penalty_definition_id, violation_date, violation_location, fine_amount, paid_amount, payment_date, payment_status, due_date, reference_number, notes, active, created_at, updated_at)
SELECT id, vehicle_id, driver_id, penalty_definition_id, violation_date, violation_location, fine_amount, paid_amount, payment_date, payment_status, due_date, reference_number, notes, active, created_at, updated_at FROM penalty_records;

DROP TABLE penalty_records;
ALTER TABLE penalty_records_new RENAME TO penalty_records;

-- ================================================
-- 7. RENAME driver_id TO employee_id IN vehicle_inspections TABLE
-- ================================================

CREATE TABLE vehicle_inspections_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inspection_number TEXT NOT NULL UNIQUE,
  vehicle_id INTEGER NOT NULL,
  checklist_id INTEGER NOT NULL,
  employee_id INTEGER,
  inspection_date INTEGER NOT NULL,
  inspection_type TEXT NOT NULL,
  odometer_reading INTEGER,
  engine_hours INTEGER,
  fuel_level REAL,
  overall_status TEXT NOT NULL,
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
);

INSERT INTO vehicle_inspections_new (id, inspection_number, vehicle_id, checklist_id, employee_id, inspection_date, inspection_type, odometer_reading, engine_hours, fuel_level, overall_status, checklist_results, issues_found, recommendations, next_inspection_due, inspected_by, supervised_by, follow_up_required, follow_up_notes, follow_up_completed, created_at, updated_at)
SELECT id, inspection_number, vehicle_id, checklist_id, driver_id, inspection_date, inspection_type, odometer_reading, engine_hours, fuel_level, overall_status, checklist_results, issues_found, recommendations, next_inspection_due, inspected_by, supervised_by, follow_up_required, follow_up_notes, follow_up_completed, created_at, updated_at FROM vehicle_inspections;

DROP TABLE vehicle_inspections;
ALTER TABLE vehicle_inspections_new RENAME TO vehicle_inspections;

-- ================================================
-- 8. UPDATE entity_type VALUES IN documents TABLE
-- ================================================

UPDATE documents SET entity_type = 'employee' WHERE entity_type = 'driver';

-- ================================================
-- 9. UPDATE entity_type VALUES IN photos TABLE
-- ================================================

UPDATE photos SET entity_type = 'employee' WHERE entity_type = 'driver';

PRAGMA foreign_keys=ON;
