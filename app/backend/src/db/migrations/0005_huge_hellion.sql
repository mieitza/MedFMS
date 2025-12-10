CREATE TABLE `inspection_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type_code` text NOT NULL,
	`type_name` text NOT NULL,
	`description` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `inspection_types_type_code_unique` ON `inspection_types` (`type_code`);
