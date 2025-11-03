CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`pin` text NOT NULL,
	`full_name` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`department_id` integer,
	`location_id` integer,
	`phone_number` text,
	`active` integer DEFAULT true NOT NULL,
	`last_login` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `vehicle_documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle_id` integer NOT NULL,
	`document_type` text NOT NULL,
	`document_number` text,
	`issue_date` integer,
	`expiry_date` integer,
	`file_path` text,
	`description` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vehicle_photos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle_id` integer NOT NULL,
	`photo_type` text NOT NULL,
	`file_path` text NOT NULL,
	`caption` text,
	`is_primary` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle_code` text NOT NULL,
	`license_plate` text NOT NULL,
	`brand_id` integer NOT NULL,
	`model_id` integer NOT NULL,
	`year` integer NOT NULL,
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
CREATE UNIQUE INDEX `vehicles_vehicle_code_unique` ON `vehicles` (`vehicle_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `vehicles_license_plate_unique` ON `vehicles` (`license_plate`);--> statement-breakpoint
CREATE TABLE `drivers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`driver_code` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`full_name` text NOT NULL,
	`id_number` text,
	`license_number` text NOT NULL,
	`license_type` text NOT NULL,
	`license_expiry_date` integer,
	`phone_number` text,
	`mobile_number` text,
	`email` text,
	`address` text,
	`city_id` integer,
	`date_of_birth` integer,
	`hire_date` integer,
	`termination_date` integer,
	`department_id` integer,
	`position_id` integer,
	`emergency_contact` text,
	`emergency_phone` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `drivers_driver_code_unique` ON `drivers` (`driver_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `drivers_id_number_unique` ON `drivers` (`id_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `drivers_license_number_unique` ON `drivers` (`license_number`);--> statement-breakpoint
CREATE TABLE `fuel_limits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle_id` integer NOT NULL,
	`fuel_type_id` integer NOT NULL,
	`daily_limit` real,
	`weekly_limit` real,
	`monthly_limit` real,
	`unit_limit` real,
	`active` integer DEFAULT true NOT NULL,
	`effective_date` integer NOT NULL,
	`expiry_date` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`fuel_type_id`) REFERENCES `fuel_types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `fuel_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`transaction_type` text NOT NULL,
	`vehicle_id` integer,
	`driver_id` integer,
	`fuel_type_id` integer NOT NULL,
	`quantity` real NOT NULL,
	`price_per_unit` real NOT NULL,
	`total_amount` real NOT NULL,
	`odometer` integer,
	`transaction_date` integer NOT NULL,
	`location_id` integer,
	`supplier_id` integer,
	`invoice_number` text,
	`description` text,
	`approved` integer DEFAULT false NOT NULL,
	`approved_by` integer,
	`approval_date` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`fuel_type_id`) REFERENCES `fuel_types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `fuel_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fuel_code` text NOT NULL,
	`fuel_name` text NOT NULL,
	`description` text,
	`unit` text DEFAULT 'L' NOT NULL,
	`current_price` real NOT NULL,
	`density` real,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `fuel_types_fuel_code_unique` ON `fuel_types` (`fuel_code`);--> statement-breakpoint
CREATE TABLE `material_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`transaction_type` text NOT NULL,
	`material_id` integer NOT NULL,
	`quantity` real NOT NULL,
	`unit_price` real,
	`total_amount` real,
	`transaction_date` integer NOT NULL,
	`warehouse_id` integer,
	`location_id` integer,
	`supplier_id` integer,
	`invoice_number` text,
	`work_order_id` integer,
	`vehicle_id` integer,
	`description` text,
	`approved` integer DEFAULT false NOT NULL,
	`approved_by` integer,
	`approval_date` integer,
	`user_id` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`material_id`) REFERENCES `materials`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `materials` (
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
CREATE UNIQUE INDEX `materials_material_code_unique` ON `materials` (`material_code`);--> statement-breakpoint
CREATE TABLE `warehouses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`warehouse_code` text NOT NULL,
	`warehouse_name` text NOT NULL,
	`description` text,
	`location_id` integer,
	`responsible_person_id` integer,
	`capacity` real,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `warehouses_warehouse_code_unique` ON `warehouses` (`warehouse_code`);--> statement-breakpoint
CREATE TABLE `axles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle_id` integer NOT NULL,
	`axle_name` text NOT NULL,
	`axle_type` text NOT NULL,
	`axle_position` integer NOT NULL,
	`max_tire_count` integer NOT NULL,
	`current_tire_count` integer DEFAULT 0 NOT NULL,
	`tire_size` text,
	`load_capacity` real,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tire_definitions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tire_code` text NOT NULL,
	`tire_name` text NOT NULL,
	`brand_id` integer,
	`model_id` integer,
	`size` text NOT NULL,
	`load_index` text,
	`speed_index` text,
	`tire_type` text,
	`pattern` text,
	`description` text,
	`standard_price` real,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tire_definitions_tire_code_unique` ON `tire_definitions` (`tire_code`);--> statement-breakpoint
CREATE TABLE `tire_inventory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tire_definition_id` integer NOT NULL,
	`serial_number` text,
	`barcode_number` text,
	`vehicle_id` integer,
	`axle_id` integer,
	`axle_position` text,
	`installation_date` integer,
	`installation_odometer` integer,
	`current_odometer` integer,
	`total_mileage` integer DEFAULT 0,
	`condition` text,
	`wear_level` real,
	`pressure_level` real,
	`last_inspection_date` integer,
	`next_inspection_date` integer,
	`removal_date` integer,
	`removal_odometer` integer,
	`removal_reason` text,
	`status` text DEFAULT 'stored' NOT NULL,
	`warehouse_id` integer,
	`location_id` integer,
	`supplier_id` integer,
	`purchase_date` integer,
	`purchase_price` real,
	`warranty_expiry_date` integer,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`tire_definition_id`) REFERENCES `tire_definitions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`axle_id`) REFERENCES `axles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tire_inventory_serial_number_unique` ON `tire_inventory` (`serial_number`);--> statement-breakpoint
CREATE TABLE `accident_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle_id` integer NOT NULL,
	`driver_id` integer,
	`accident_date` integer NOT NULL,
	`location` text,
	`description` text,
	`severity` text,
	`fault_percentage` integer,
	`police_report_number` text,
	`insurance_claim_number` text,
	`estimated_cost` real,
	`actual_cost` real,
	`status` text DEFAULT 'reported' NOT NULL,
	`notes` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `insurance_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle_id` integer NOT NULL,
	`policy_number` text NOT NULL,
	`insurance_company_id` integer,
	`policy_type` text,
	`coverage_amount` real,
	`premium_amount` real,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`deductible_amount` real,
	`agent_name` text,
	`agent_phone` text,
	`status` text DEFAULT 'active' NOT NULL,
	`notes` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `penalty_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle_id` integer NOT NULL,
	`driver_id` integer,
	`penalty_definition_id` integer,
	`violation_date` integer NOT NULL,
	`violation_location` text,
	`fine_amount` real NOT NULL,
	`paid_amount` real DEFAULT 0,
	`payment_date` integer,
	`payment_status` text DEFAULT 'unpaid' NOT NULL,
	`due_date` integer,
	`reference_number` text,
	`notes` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `service_definitions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`service_code` text NOT NULL,
	`service_name` text NOT NULL,
	`service_type` text NOT NULL,
	`category` text,
	`description` text,
	`standard_duration` integer,
	`standard_cost` real,
	`required_skills` text,
	`frequency_type` text,
	`frequency_value` integer,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `service_definitions_service_code_unique` ON `service_definitions` (`service_code`);--> statement-breakpoint
CREATE TABLE `service_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`work_order_number` text NOT NULL,
	`vehicle_id` integer NOT NULL,
	`service_definition_id` integer,
	`scheduled_date` integer,
	`actual_start_date` integer,
	`actual_end_date` integer,
	`odometer` integer,
	`description` text,
	`service_provider_id` integer,
	`labor_cost` real,
	`material_cost` real,
	`total_cost` real,
	`status` text DEFAULT 'scheduled' NOT NULL,
	`approved_by` integer,
	`approval_date` integer,
	`notes` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`service_definition_id`) REFERENCES `service_definitions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `service_transactions_work_order_number_unique` ON `service_transactions` (`work_order_number`);--> statement-breakpoint
CREATE TABLE `brands` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`brand_code` text NOT NULL,
	`brand_name` text NOT NULL,
	`description` text,
	`country` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `brands_brand_code_unique` ON `brands` (`brand_code`);--> statement-breakpoint
CREATE TABLE `cities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`city_code` text NOT NULL,
	`city_name` text NOT NULL,
	`state_province` text,
	`country` text,
	`postal_code` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cities_city_code_unique` ON `cities` (`city_code`);--> statement-breakpoint
CREATE TABLE `custom_fields` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`entity_type` text NOT NULL,
	`field_number` integer NOT NULL,
	`field_name` text NOT NULL,
	`field_type` text NOT NULL,
	`required` integer DEFAULT false NOT NULL,
	`default_value` text,
	`reference_table` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `departments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`department_code` text NOT NULL,
	`department_name` text NOT NULL,
	`parent_department_id` integer,
	`manager_id` integer,
	`location_id` integer,
	`description` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `departments_department_code_unique` ON `departments` (`department_code`);--> statement-breakpoint
CREATE TABLE `locations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`location_code` text NOT NULL,
	`location_name` text NOT NULL,
	`parent_location_id` integer,
	`level` integer DEFAULT 1 NOT NULL,
	`location_path` text,
	`responsible_person_id` integer,
	`address` text,
	`city_id` integer,
	`phone_number` text,
	`capacity` integer,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `locations_location_code_unique` ON `locations` (`location_code`);--> statement-breakpoint
CREATE TABLE `models` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`model_code` text NOT NULL,
	`model_name` text NOT NULL,
	`brand_id` integer NOT NULL,
	`year` integer,
	`fuel_type` text,
	`engine_capacity` real,
	`transmission_type` text,
	`body_type` text,
	`description` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `models_model_code_unique` ON `models` (`model_code`);--> statement-breakpoint
CREATE TABLE `penalty_definitions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`penalty_code` text NOT NULL,
	`penalty_name` text NOT NULL,
	`penalty_type` text,
	`description` text,
	`standard_amount` real,
	`currency` text DEFAULT 'RON' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `penalty_definitions_penalty_code_unique` ON `penalty_definitions` (`penalty_code`);--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`supplier_code` text NOT NULL,
	`supplier_name` text NOT NULL,
	`contact_person` text,
	`phone_number` text,
	`email` text,
	`address` text,
	`city_id` integer,
	`tax_number` text,
	`bank_account` text,
	`supplier_type` text,
	`rating` integer,
	`notes` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `suppliers_supplier_code_unique` ON `suppliers` (`supplier_code`);--> statement-breakpoint
CREATE TABLE `vehicle_statuses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`status_code` text NOT NULL,
	`status_name` text NOT NULL,
	`description` text,
	`color_code` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vehicle_statuses_status_code_unique` ON `vehicle_statuses` (`status_code`);--> statement-breakpoint
CREATE TABLE `vehicle_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type_code` text NOT NULL,
	`type_name` text NOT NULL,
	`description` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vehicle_types_type_code_unique` ON `vehicle_types` (`type_code`);