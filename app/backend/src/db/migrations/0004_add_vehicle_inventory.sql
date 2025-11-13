-- Add vehicle inventory tables
CREATE TABLE `vehicle_inventory_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_code` text NOT NULL,
	`category_name` text NOT NULL,
	`description` text,
	`requires_expiration` integer DEFAULT false NOT NULL,
	`requires_serial_number` integer DEFAULT false NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vehicle_inventory_categories_category_code_unique` ON `vehicle_inventory_categories` (`category_code`);
--> statement-breakpoint
CREATE TABLE `vehicle_inventory_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`item_code` text NOT NULL,
	`item_name` text NOT NULL,
	`category_id` integer NOT NULL,
	`description` text,
	`manufacturer` text,
	`model` text,
	`unit_of_measure` text,
	`min_quantity` integer,
	`max_quantity` integer,
	`standard_price` real,
	`requires_expiration` integer DEFAULT false NOT NULL,
	`requires_serial_number` integer DEFAULT false NOT NULL,
	`requires_certification` integer DEFAULT false NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `vehicle_inventory_categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vehicle_inventory_items_item_code_unique` ON `vehicle_inventory_items` (`item_code`);
--> statement-breakpoint
CREATE TABLE `vehicle_inventory_assignments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle_id` integer NOT NULL,
	`item_id` integer NOT NULL,
	`serial_number` text,
	`batch_number` text,
	`quantity` integer DEFAULT 1 NOT NULL,
	`condition` text DEFAULT 'good' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`purchase_date` integer,
	`purchase_price` real,
	`supplier_id` integer,
	`assignment_date` integer,
	`expiration_date` integer,
	`manufacture_date` integer,
	`last_inspection_date` integer,
	`next_inspection_date` integer,
	`certification_number` text,
	`certification_date` integer,
	`certification_expiry_date` integer,
	`removal_date` integer,
	`removal_reason` text,
	`removal_notes` text,
	`location` text,
	`notes` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` integer,
	`updated_by` integer,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`item_id`) REFERENCES `vehicle_inventory_items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vehicle_inventory_inspections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`assignment_id` integer NOT NULL,
	`inspection_date` integer NOT NULL,
	`inspector_id` integer,
	`inspection_type` text NOT NULL,
	`condition` text NOT NULL,
	`notes` text,
	`issues_found` text,
	`action_taken` text,
	`next_inspection_date` integer,
	`passed` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` integer,
	FOREIGN KEY (`assignment_id`) REFERENCES `vehicle_inventory_assignments`(`id`) ON UPDATE no action ON DELETE no action
);
