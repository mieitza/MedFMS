-- Add warehouse features: expiration dates, units, and transfer requests

-- Add expiration_date column to materials table
ALTER TABLE `materials` ADD COLUMN `expiration_date` integer;

-- Create material_units table for customizable unit labels
CREATE TABLE IF NOT EXISTS `material_units` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`unit_code` text NOT NULL UNIQUE,
	`unit_name` text NOT NULL,
	`unit_name_plural` text,
	`abbreviation` text NOT NULL,
	`description` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `material_units_unit_code_unique` ON `material_units` (`unit_code`);

-- Create warehouse_transfer_requests table (similar to maintenance work orders)
CREATE TABLE IF NOT EXISTS `warehouse_transfer_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`request_number` text NOT NULL UNIQUE,
	`source_warehouse_id` integer NOT NULL,
	`destination_warehouse_id` integer NOT NULL,
	`material_id` integer NOT NULL,
	`quantity` real NOT NULL,
	`requested_quantity` real,
	`approved_quantity` real,
	`transferred_quantity` real,
	`status` text DEFAULT 'pending' NOT NULL,
	`priority` integer DEFAULT 3 NOT NULL,
	`requested_date` integer NOT NULL,
	`required_by_date` integer,
	`approved_date` integer,
	`transfer_date` integer,
	`completed_date` integer,
	`reason` text,
	`notes` text,
	`requested_by` integer NOT NULL,
	`approved_by` integer,
	`rejected_by` integer,
	`rejection_reason` text,
	`transferred_by` integer,
	`received_by` integer,
	`received_date` integer,
	`quality_check` integer DEFAULT false,
	`quality_check_by` integer,
	`quality_check_date` integer,
	`quality_check_notes` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`source_warehouse_id`) REFERENCES `warehouses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`destination_warehouse_id`) REFERENCES `warehouses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`material_id`) REFERENCES `materials`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE UNIQUE INDEX IF NOT EXISTS `warehouse_transfer_requests_request_number_unique` ON `warehouse_transfer_requests` (`request_number`);

-- Insert default material unit labels
INSERT OR IGNORE INTO `material_units` (`unit_code`, `unit_name`, `unit_name_plural`, `abbreviation`, `description`) VALUES
('PILLS', 'Pastilă', 'Pastile', 'past.', 'Unit for pills/tablets'),
('VIALS', 'Fiolă', 'Fiole', 'fiolă', 'Unit for vials/ampoules'),
('BOXES', 'Cutie', 'Cutii', 'cut.', 'Unit for boxes'),
('BOTTLES', 'Sticlă', 'Sticle', 'st.', 'Unit for bottles'),
('SYRINGES', 'Seringă', 'Seringi', 'ser.', 'Unit for syringes'),
('BAGS', 'Pungă', 'Pungi', 'pungă', 'Unit for bags'),
('TUBES', 'Tub', 'Tuburi', 'tub', 'Unit for tubes'),
('PIECES', 'Bucată', 'Bucăți', 'buc.', 'General unit for pieces'),
('LITERS', 'Litru', 'Litri', 'L', 'Unit for liquids'),
('MILLILITERS', 'Mililitru', 'Mililitri', 'mL', 'Unit for small liquid volumes'),
('GRAMS', 'Gram', 'Grame', 'g', 'Unit for weight'),
('KILOGRAMS', 'Kilogram', 'Kilograme', 'kg', 'Unit for larger weights'),
('METERS', 'Metru', 'Metri', 'm', 'Unit for length'),
('SETS', 'Set', 'Seturi', 'set', 'Unit for sets/kits');
