ALTER TABLE `fuel_transactions` ADD `card_number` text;--> statement-breakpoint
ALTER TABLE `fuel_transactions` ADD `cost_center1` text;--> statement-breakpoint
ALTER TABLE `fuel_transactions` ADD `cost_center2` text;--> statement-breakpoint
ALTER TABLE `fuel_transactions` ADD `country` text;--> statement-breakpoint
ALTER TABLE `fuel_transactions` ADD `postal_code` text;--> statement-breakpoint
ALTER TABLE `fuel_transactions` ADD `station_external_id` text;--> statement-breakpoint
ALTER TABLE `fuel_transactions` ADD `vat_rate` real;--> statement-breakpoint
ALTER TABLE `fuel_transactions` ADD `vat_amount` real;--> statement-breakpoint
ALTER TABLE `fuel_transactions` ADD `amount_excl_vat` real;--> statement-breakpoint
ALTER TABLE `fuel_transactions` ADD `currency` text DEFAULT 'RON';--> statement-breakpoint
ALTER TABLE `fuel_transactions` ADD `voucher_number` text;--> statement-breakpoint
ALTER TABLE `fuel_transactions` ADD `external_reference` text;--> statement-breakpoint
ALTER TABLE `fuel_transactions` ADD `import_batch_id` text;--> statement-breakpoint
ALTER TABLE `fuel_transactions` ADD `delivery_date` integer;--> statement-breakpoint
ALTER TABLE `fuel_transactions` ADD `delivery_time` text;--> statement-breakpoint
ALTER TABLE `fuel_transactions` ADD `invoice_date` integer;--> statement-breakpoint
ALTER TABLE `fuel_transactions` ADD `product_name` text;--> statement-breakpoint
ALTER TABLE `fuel_transactions` ADD `product_category` text;--> statement-breakpoint
ALTER TABLE `fuel_transactions` ADD `import_source` text;--> statement-breakpoint
ALTER TABLE `fuel_transactions` ADD `import_notes` text;