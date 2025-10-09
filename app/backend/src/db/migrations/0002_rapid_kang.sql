PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_vehicles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle_code` text NOT NULL,
	`license_plate` text NOT NULL,
	`brand_id` integer NOT NULL,
	`model_id` integer NOT NULL,
	`year` integer,
	`fuel_type_id` integer NOT NULL,
	`vehicle_type_id` integer NOT NULL,
	`status_id` integer NOT NULL,
	`location_id` integer,
	`department_id` integer,
	`driver_id` integer,
	`registration_date` integer,
	`acquisition_date` integer,
	`purchase_price` real,
	`current_value` real,
	`odometer` integer DEFAULT 0 NOT NULL,
	`engine_number` text,
	`chassis_number` text,
	`description` text,
	`active` integer DEFAULT true NOT NULL,
	`custom_field_1` text,
	`custom_field_2` text,
	`custom_field_3` text,
	`custom_field_4` text,
	`custom_field_5` text,
	`custom_field_6` text,
	`custom_field_7` text,
	`custom_field_8` text,
	`custom_field_9` real,
	`custom_field_10` real,
	`custom_field_11` text,
	`custom_field_12` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_vehicles`("id", "vehicle_code", "license_plate", "brand_id", "model_id", "year", "fuel_type_id", "vehicle_type_id", "status_id", "location_id", "department_id", "driver_id", "registration_date", "acquisition_date", "purchase_price", "current_value", "odometer", "engine_number", "chassis_number", "description", "active", "custom_field_1", "custom_field_2", "custom_field_3", "custom_field_4", "custom_field_5", "custom_field_6", "custom_field_7", "custom_field_8", "custom_field_9", "custom_field_10", "custom_field_11", "custom_field_12", "created_at", "updated_at") SELECT "id", "vehicle_code", "license_plate", "brand_id", "model_id", "year", "fuel_type_id", "vehicle_type_id", "status_id", "location_id", "department_id", "driver_id", "registration_date", "acquisition_date", "purchase_price", "current_value", "odometer", "engine_number", "chassis_number", "description", "active", "custom_field_1", "custom_field_2", "custom_field_3", "custom_field_4", "custom_field_5", "custom_field_6", "custom_field_7", "custom_field_8", "custom_field_9", "custom_field_10", "custom_field_11", "custom_field_12", "created_at", "updated_at" FROM `vehicles`;--> statement-breakpoint
DROP TABLE `vehicles`;--> statement-breakpoint
ALTER TABLE `__new_vehicles` RENAME TO `vehicles`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `vehicles_vehicle_code_unique` ON `vehicles` (`vehicle_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `vehicles_license_plate_unique` ON `vehicles` (`license_plate`);
