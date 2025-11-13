-- Add unified transfer system support: warehouse->vehicle, vehicle->warehouse, warehouse->employee
-- This migration extends the existing warehouse_transfer_requests table to support multiple destination types

-- Step 1: Add new columns to vehicle_inventory_items table
ALTER TABLE `vehicle_inventory_items` ADD COLUMN `material_id` integer;

-- Step 2: Add new columns to warehouse_transfer_requests table
ALTER TABLE `warehouse_transfer_requests` ADD COLUMN `transfer_type` text DEFAULT 'warehouse-to-warehouse' NOT NULL;
ALTER TABLE `warehouse_transfer_requests` ADD COLUMN `destination_vehicle_id` integer;
ALTER TABLE `warehouse_transfer_requests` ADD COLUMN `destination_employee_id` integer;
ALTER TABLE `warehouse_transfer_requests` ADD COLUMN `vehicle_inventory_item_id` integer;
ALTER TABLE `warehouse_transfer_requests` ADD COLUMN `auto_approve` integer DEFAULT false NOT NULL;

-- Step 3: Make destinationWarehouseId nullable (SQLite doesn't support modifying columns directly)
-- We'll handle this by allowing NULL values in application logic for new records

-- Step 4: Update existing records to set transfer_type
UPDATE `warehouse_transfer_requests` SET `transfer_type` = 'warehouse-to-warehouse' WHERE `transfer_type` IS NULL OR `transfer_type` = '';

-- Note: SQLite doesn't support making expiration_date NOT NULL with ALTER TABLE
-- The schema change for materials.expirationDate will be enforced at the application level
-- New materials must have expiration dates, existing ones without will need to be updated manually
