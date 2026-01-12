PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_materials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`material_code` text NOT NULL,
	`material_name` text NOT NULL,
	`description` text,
	`material_type_id` integer,
	`category_id` integer,
	`unit_id` integer NOT NULL,
	`current_stock` real DEFAULT 0 NOT NULL,
	`critical_level` real,
	`standard_price` real,
	`last_purchase_price` real,
	`last_purchase_date` integer,
	`last_sale_price` real,
	`last_sale_date` integer,
	`supplier_id` integer,
	`barcode_number` text,
	`serial_number` text,
	`shelf_location` text,
	`warehouse_id` integer,
	`expiration_date` integer,
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
INSERT INTO `__new_materials`("id", "material_code", "material_name", "description", "material_type_id", "category_id", "unit_id", "current_stock", "critical_level", "standard_price", "last_purchase_price", "last_purchase_date", "last_sale_price", "last_sale_date", "supplier_id", "barcode_number", "serial_number", "shelf_location", "warehouse_id", "expiration_date", "active", "custom_field_1", "custom_field_2", "custom_field_3", "custom_field_4", "custom_field_5", "custom_field_6", "custom_field_7", "custom_field_8", "custom_field_9", "custom_field_10", "custom_field_11", "custom_field_12", "created_at", "updated_at") SELECT "id", "material_code", "material_name", "description", "material_type_id", "category_id", "unit_id", "current_stock", "critical_level", "standard_price", "last_purchase_price", "last_purchase_date", "last_sale_price", "last_sale_date", "supplier_id", "barcode_number", "serial_number", "shelf_location", "warehouse_id", "expiration_date", "active", "custom_field_1", "custom_field_2", "custom_field_3", "custom_field_4", "custom_field_5", "custom_field_6", "custom_field_7", "custom_field_8", "custom_field_9", "custom_field_10", "custom_field_11", "custom_field_12", "created_at", "updated_at" FROM `materials`;--> statement-breakpoint
DROP TABLE `materials`;--> statement-breakpoint
ALTER TABLE `__new_materials` RENAME TO `materials`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `materials_material_code_unique` ON `materials` (`material_code`);