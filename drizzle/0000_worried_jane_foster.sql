CREATE TABLE `daily_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`date` integer NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`amount` real NOT NULL,
	`bucket` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `digital_assets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`date` integer NOT NULL,
	`type` text NOT NULL,
	`platform` text NOT NULL,
	`rate_per_gram` real NOT NULL,
	`amount_paid` real NOT NULL,
	`gst_3_percent` real DEFAULT 0 NOT NULL,
	`weight_g` real NOT NULL,
	`asset_value` real NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `equity_assets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`date` integer NOT NULL,
	`company` text NOT NULL,
	`exchange` text NOT NULL,
	`price_per_share` real NOT NULL,
	`total_shares` integer NOT NULL,
	`total_amount` real NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `monthly_incomes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`month` text NOT NULL,
	`salary` real DEFAULT 0 NOT NULL,
	`other_income` real DEFAULT 0 NOT NULL,
	`total_income` real NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
