-- Multi-tenancy migration: Add companies table and companyId to all relevant tables
-- This migration creates the foundation for multi-company support

-- Step 1: Create companies table
CREATE TABLE IF NOT EXISTS `companies` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `company_code` text NOT NULL UNIQUE,
  `company_name` text NOT NULL,
  `legal_name` text,
  `tax_id` text,
  `registration_number` text,
  `address` text,
  `city` text,
  `county` text,
  `postal_code` text,
  `country` text DEFAULT 'Romania',
  `phone_number` text,
  `email` text,
  `website` text,
  `logo` text,
  `settings` text,
  `active` integer DEFAULT true NOT NULL,
  `created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Step 2: Insert default company for existing data
INSERT INTO `companies` (`company_code`, `company_name`, `legal_name`, `active`)
VALUES ('DEFAULT', 'Default Company', 'Default Company', true);

-- Step 3: Add company_id column to users table
ALTER TABLE `users` ADD COLUMN `company_id` integer REFERENCES `companies`(`id`);

-- Step 4: Update existing users to belong to default company
UPDATE `users` SET `company_id` = 1 WHERE `company_id` IS NULL;

-- Step 5: Add company_id to vehicles table
ALTER TABLE `vehicles` ADD COLUMN `company_id` integer REFERENCES `companies`(`id`);
UPDATE `vehicles` SET `company_id` = 1 WHERE `company_id` IS NULL;

-- Step 6: Add company_id to drivers table
ALTER TABLE `drivers` ADD COLUMN `company_id` integer REFERENCES `companies`(`id`);
UPDATE `drivers` SET `company_id` = 1 WHERE `company_id` IS NULL;

-- Step 7: Add company_id to locations table
ALTER TABLE `locations` ADD COLUMN `company_id` integer REFERENCES `companies`(`id`);
UPDATE `locations` SET `company_id` = 1 WHERE `company_id` IS NULL;

-- Step 8: Add company_id to departments table
ALTER TABLE `departments` ADD COLUMN `company_id` integer REFERENCES `companies`(`id`);
UPDATE `departments` SET `company_id` = 1 WHERE `company_id` IS NULL;

-- Step 9: Add company_id to suppliers table
ALTER TABLE `suppliers` ADD COLUMN `company_id` integer REFERENCES `companies`(`id`);
UPDATE `suppliers` SET `company_id` = 1 WHERE `company_id` IS NULL;

-- Step 10: Add company_id to maintenance_work_orders table
ALTER TABLE `maintenance_work_orders` ADD COLUMN `company_id` integer REFERENCES `companies`(`id`);
UPDATE `maintenance_work_orders` SET `company_id` = 1 WHERE `company_id` IS NULL;

-- Step 11: Add company_id to fuel_transactions table
ALTER TABLE `fuel_transactions` ADD COLUMN `company_id` integer REFERENCES `companies`(`id`);
UPDATE `fuel_transactions` SET `company_id` = 1 WHERE `company_id` IS NULL;

-- Step 12: Add company_id to materials table
ALTER TABLE `materials` ADD COLUMN `company_id` integer REFERENCES `companies`(`id`);
UPDATE `materials` SET `company_id` = 1 WHERE `company_id` IS NULL;

-- Step 13: Add company_id to warehouses table
ALTER TABLE `warehouses` ADD COLUMN `company_id` integer REFERENCES `companies`(`id`);
UPDATE `warehouses` SET `company_id` = 1 WHERE `company_id` IS NULL;

-- Step 14: Add company_id to material_transactions table
ALTER TABLE `material_transactions` ADD COLUMN `company_id` integer REFERENCES `companies`(`id`);
UPDATE `material_transactions` SET `company_id` = 1 WHERE `company_id` IS NULL;

-- Step 15: Add company_id to warehouse_transfer_requests table
ALTER TABLE `warehouse_transfer_requests` ADD COLUMN `company_id` integer REFERENCES `companies`(`id`);
UPDATE `warehouse_transfer_requests` SET `company_id` = 1 WHERE `company_id` IS NULL;

-- Step 16: Create index for faster company-based queries
CREATE INDEX IF NOT EXISTS `idx_users_company_id` ON `users`(`company_id`);
CREATE INDEX IF NOT EXISTS `idx_vehicles_company_id` ON `vehicles`(`company_id`);
CREATE INDEX IF NOT EXISTS `idx_drivers_company_id` ON `drivers`(`company_id`);
CREATE INDEX IF NOT EXISTS `idx_locations_company_id` ON `locations`(`company_id`);
CREATE INDEX IF NOT EXISTS `idx_departments_company_id` ON `departments`(`company_id`);
CREATE INDEX IF NOT EXISTS `idx_suppliers_company_id` ON `suppliers`(`company_id`);
CREATE INDEX IF NOT EXISTS `idx_maintenance_work_orders_company_id` ON `maintenance_work_orders`(`company_id`);
CREATE INDEX IF NOT EXISTS `idx_fuel_transactions_company_id` ON `fuel_transactions`(`company_id`);
CREATE INDEX IF NOT EXISTS `idx_materials_company_id` ON `materials`(`company_id`);
CREATE INDEX IF NOT EXISTS `idx_warehouses_company_id` ON `warehouses`(`company_id`);
CREATE INDEX IF NOT EXISTS `idx_material_transactions_company_id` ON `material_transactions`(`company_id`);
CREATE INDEX IF NOT EXISTS `idx_warehouse_transfer_requests_company_id` ON `warehouse_transfer_requests`(`company_id`);

-- Step 17: Update the first admin user to be super_admin (if exists)
UPDATE `users` SET `role` = 'super_admin' WHERE `id` = 1 AND `role` = 'admin';
