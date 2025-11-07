-- Manual database push to create missing tables

-- Create fuel_budgets table
CREATE TABLE IF NOT EXISTS `fuel_budgets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`budget_code` text NOT NULL UNIQUE,
	`budget_name` text NOT NULL,
	`period_type` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`allocated_amount` real NOT NULL,
	`spent_amount` real DEFAULT 0 NOT NULL,
	`remaining_amount` real NOT NULL,
	`currency` text DEFAULT 'RON' NOT NULL,
	`department_id` integer,
	`vehicle_id` integer,
	`description` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE UNIQUE INDEX IF NOT EXISTS `fuel_budgets_budget_code_unique` ON `fuel_budgets` (`budget_code`);

-- Create fuel_cards table
CREATE TABLE IF NOT EXISTS `fuel_cards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`card_number` text NOT NULL UNIQUE,
	`card_provider` text NOT NULL,
	`vehicle_id` integer,
	`driver_id` integer,
	`expiry_date` integer,
	`credit_limit` real,
	`current_balance` real DEFAULT 0 NOT NULL,
	`daily_limit` real,
	`weekly_limit` real,
	`monthly_limit` real,
	`allowed_fuel_types` text,
	`allowed_stations` text,
	`pin_code` text,
	`active` integer DEFAULT true NOT NULL,
	`blocked` integer DEFAULT false NOT NULL,
	`block_reason` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE UNIQUE INDEX IF NOT EXISTS `fuel_cards_card_number_unique` ON `fuel_cards` (`card_number`);

-- Create vehicle_fuel_tanks table
CREATE TABLE IF NOT EXISTS `vehicle_fuel_tanks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle_id` integer NOT NULL,
	`tank_number` integer DEFAULT 1 NOT NULL,
	`fuel_type_id` integer NOT NULL,
	`capacity` real NOT NULL,
	`current_level` real DEFAULT 0 NOT NULL,
	`minimum_level` real DEFAULT 0 NOT NULL,
	`last_updated` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`fuel_type_id`) REFERENCES `fuel_types`(`id`) ON UPDATE no action ON DELETE no action
);

-- Create inspection_checklists table
CREATE TABLE IF NOT EXISTS `inspection_checklists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`checklist_name` text NOT NULL,
	`checklist_type` text NOT NULL,
	`vehicle_type_id` integer,
	`checklist_items` text NOT NULL,
	`required` integer DEFAULT false NOT NULL,
	`frequency` integer,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create maintenance_types table (must be created before other maintenance tables due to FKs)
CREATE TABLE IF NOT EXISTS `maintenance_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type_code` text NOT NULL UNIQUE,
	`type_name` text NOT NULL,
	`category` text NOT NULL,
	`description` text,
	`estimated_duration` integer,
	`estimated_cost` real,
	`priority` integer DEFAULT 3 NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `maintenance_types_type_code_unique` ON `maintenance_types` (`type_code`);

-- Create maintenance_schedules table
CREATE TABLE IF NOT EXISTS `maintenance_schedules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle_id` integer NOT NULL,
	`maintenance_type_id` integer NOT NULL,
	`interval_type` text NOT NULL,
	`interval_value` integer NOT NULL,
	`last_maintenance_date` integer,
	`last_maintenance_km` integer,
	`last_maintenance_hours` integer,
	`next_maintenance_date` integer,
	`next_maintenance_km` integer,
	`next_maintenance_hours` integer,
	`reminder_days_before` integer DEFAULT 7 NOT NULL,
	`reminder_km_before` integer DEFAULT 500 NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`maintenance_type_id`) REFERENCES `maintenance_types`(`id`) ON UPDATE no action ON DELETE no action
);

-- Create maintenance_work_orders table
CREATE TABLE IF NOT EXISTS `maintenance_work_orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`work_order_number` text NOT NULL UNIQUE,
	`vehicle_id` integer NOT NULL,
	`maintenance_type_id` integer,
	`schedule_id` integer,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`priority` integer DEFAULT 3,
	`requested_date` integer NOT NULL,
	`scheduled_date` integer,
	`started_date` integer,
	`completed_date` integer,
	`due_date` integer,
	`assigned_to` text,
	`facility` text,
	`odometer_reading` integer,
	`engine_hours` integer,
	`work_instructions` text,
	`parts_needed` text,
	`labor_hours` real,
	`estimated_cost` real,
	`actual_cost` real,
	`vendor` text,
	`vendor_invoice` text,
	`warranty_claim` integer DEFAULT false,
	`insurance_claim` integer DEFAULT false,
	`downtime_hours` real,
	`approval_required` integer DEFAULT false,
	`approved_by` text,
	`approval_date` integer,
	`completion_notes` text,
	`quality_check` integer DEFAULT false,
	`quality_check_by` text,
	`quality_check_date` integer,
	`quality_check_notes` text,
	`follow_up_required` integer DEFAULT false,
	`follow_up_date` integer,
	`follow_up_notes` text,
	`created_by` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`maintenance_type_id`) REFERENCES `maintenance_types`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`schedule_id`) REFERENCES `maintenance_schedules`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE UNIQUE INDEX IF NOT EXISTS `maintenance_work_orders_work_order_number_unique` ON `maintenance_work_orders` (`work_order_number`);

-- Create maintenance_history table
CREATE TABLE IF NOT EXISTS `maintenance_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle_id` integer NOT NULL,
	`work_order_id` integer NOT NULL,
	`maintenance_type_id` integer NOT NULL,
	`maintenance_date` integer NOT NULL,
	`odometer_reading` integer,
	`engine_hours` integer,
	`work_performed` text NOT NULL,
	`parts_replaced` text,
	`issues` text,
	`recommendations` text,
	`fuel_efficiency_before` real,
	`fuel_efficiency_after` real,
	`performance_notes` text,
	`total_cost` real NOT NULL,
	`labor_cost` real,
	`parts_cost` real,
	`external_cost` real,
	`currency` text DEFAULT 'RON' NOT NULL,
	`duration` integer,
	`downtime` integer,
	`quality_rating` integer,
	`warranty_period` integer,
	`warranty_expiry_date` integer,
	`performed_by` text,
	`supervised_by` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`work_order_id`) REFERENCES `maintenance_work_orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`maintenance_type_id`) REFERENCES `maintenance_types`(`id`) ON UPDATE no action ON DELETE no action
);

-- Create maintenance_labor table
CREATE TABLE IF NOT EXISTS `maintenance_labor` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`work_order_id` integer NOT NULL,
	`technician_name` text NOT NULL,
	`labor_type` text,
	`hours_worked` real NOT NULL,
	`hourly_rate` real,
	`total_cost` real,
	`work_performed` text,
	`date` integer NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`work_order_id`) REFERENCES `maintenance_work_orders`(`id`) ON UPDATE no action ON DELETE no action
);

-- Create maintenance_parts table
CREATE TABLE IF NOT EXISTS `maintenance_parts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`work_order_id` integer NOT NULL,
	`part_number` text,
	`part_name` text NOT NULL,
	`description` text,
	`quantity` integer DEFAULT 1 NOT NULL,
	`unit_price` real,
	`total_price` real,
	`supplier` text,
	`warranty_months` integer,
	`warranty_km` integer,
	`core_charge` real,
	`core_returned` integer DEFAULT false,
	`installation_date` integer,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`work_order_id`) REFERENCES `maintenance_work_orders`(`id`) ON UPDATE no action ON DELETE no action
);

-- Create maintenance_alerts table
CREATE TABLE IF NOT EXISTS `maintenance_alerts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle_id` integer NOT NULL,
	`schedule_id` integer,
	`alert_type` text NOT NULL,
	`alert_title` text NOT NULL,
	`alert_message` text NOT NULL,
	`priority` integer DEFAULT 3 NOT NULL,
	`due_date` integer,
	`due_kilometers` integer,
	`due_hours` integer,
	`days_past_due` integer,
	`kilometers_past_due` integer,
	`acknowledged` integer DEFAULT false NOT NULL,
	`acknowledged_by` integer,
	`acknowledged_at` integer,
	`resolved` integer DEFAULT false NOT NULL,
	`resolved_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`schedule_id`) REFERENCES `maintenance_schedules`(`id`) ON UPDATE no action ON DELETE no action
);

-- Create vehicle_inspections table
CREATE TABLE IF NOT EXISTS `vehicle_inspections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`inspection_number` text NOT NULL UNIQUE,
	`vehicle_id` integer NOT NULL,
	`checklist_id` integer NOT NULL,
	`driver_id` integer,
	`inspection_date` integer NOT NULL,
	`inspection_type` text NOT NULL,
	`odometer_reading` integer,
	`engine_hours` integer,
	`fuel_level` real,
	`overall_status` text NOT NULL,
	`checklist_results` text NOT NULL,
	`issues_found` text,
	`recommendations` text,
	`next_inspection_due` integer,
	`inspected_by` text NOT NULL,
	`supervised_by` text,
	`follow_up_required` integer DEFAULT false NOT NULL,
	`follow_up_notes` text,
	`follow_up_completed` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`checklist_id`) REFERENCES `inspection_checklists`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE UNIQUE INDEX IF NOT EXISTS `vehicle_inspections_inspection_number_unique` ON `vehicle_inspections` (`inspection_number`);

-- Create system_fuel_types table
CREATE TABLE IF NOT EXISTS `system_fuel_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type_code` text NOT NULL UNIQUE,
	`type_name` text NOT NULL,
	`description` text,
	`unit` text DEFAULT 'L' NOT NULL,
	`price_per_unit` real,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `system_fuel_types_type_code_unique` ON `system_fuel_types` (`type_code`);

-- Create license_types table
CREATE TABLE IF NOT EXISTS `license_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type_code` text NOT NULL UNIQUE,
	`type_name` text NOT NULL,
	`description` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `license_types_type_code_unique` ON `license_types` (`type_code`);

-- Create material_categories table
CREATE TABLE IF NOT EXISTS `material_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_code` text NOT NULL UNIQUE,
	`category_name` text NOT NULL,
	`description` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `material_categories_category_code_unique` ON `material_categories` (`category_code`);

-- Create material_types table
CREATE TABLE IF NOT EXISTS `material_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type_code` text NOT NULL UNIQUE,
	`type_name` text NOT NULL,
	`description` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `material_types_type_code_unique` ON `material_types` (`type_code`);

-- Create positions table
CREATE TABLE IF NOT EXISTS `positions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`position_code` text NOT NULL UNIQUE,
	`position_name` text NOT NULL,
	`description` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `positions_position_code_unique` ON `positions` (`position_code`);

-- Create units table
CREATE TABLE IF NOT EXISTS `units` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`unit_code` text NOT NULL UNIQUE,
	`unit_name` text NOT NULL,
	`description` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `units_unit_code_unique` ON `units` (`unit_code`);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`username` text,
	`action` text NOT NULL,
	`resource` text NOT NULL,
	`resource_id` text,
	`details` text,
	`ip_address` text,
	`user_agent` text,
	`timestamp` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
