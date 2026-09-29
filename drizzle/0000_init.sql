CREATE TABLE `ad_records` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`period` text DEFAULT '' NOT NULL,
	`spend_lkr` real DEFAULT 0 NOT NULL,
	`roas` real DEFAULT 0 NOT NULL,
	`cpc_lkr` real DEFAULT 0 NOT NULL,
	`cvr_pct` real DEFAULT 0 NOT NULL,
	`cost_per_purchase_lkr` real DEFAULT 0 NOT NULL,
	`purchases` integer DEFAULT 0 NOT NULL,
	`monthly_roas` text DEFAULT '[]' NOT NULL,
	`split` text DEFAULT '{"conversions":0,"leadgen":0,"retargeting":0,"awareness":0}' NOT NULL,
	`visibility` text DEFAULT 'internal' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`short_name` text,
	`sector` text NOT NULL,
	`since_year` integer,
	`engagement` text DEFAULT 'project' NOT NULL,
	`logo_url` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `enquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`company` text DEFAULT '' NOT NULL,
	`email` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`service` text DEFAULT '' NOT NULL,
	`budget` text DEFAULT '' NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`user_agent` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `enquiries_created_idx` ON `enquiries` (`created_at`);--> statement-breakpoint
CREATE TABLE `media_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`caption` text DEFAULT '' NOT NULL,
	`label` text DEFAULT '' NOT NULL,
	`client_id` text,
	`kind` text DEFAULT 'photo' NOT NULL,
	`ratio` text DEFAULT '3:4' NOT NULL,
	`url` text,
	`status` text DEFAULT 'unpublished' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`client_id` text,
	`sector` text NOT NULL,
	`services` text DEFAULT '[]' NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`metrics` text DEFAULT '[]' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`hero_url` text,
	`reel_url` text,
	`gallery` text DEFAULT '[]' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`platforms` text DEFAULT '' NOT NULL,
	`tags` text DEFAULT '' NOT NULL,
	`card_stats` text DEFAULT '[]' NOT NULL,
	`trend` text DEFAULT '[]' NOT NULL,
	`headline` text DEFAULT '' NOT NULL,
	`intro` text DEFAULT '' NOT NULL,
	`sector_detail` text DEFAULT '' NOT NULL,
	`engagement_period` text DEFAULT '' NOT NULL,
	`scope` text DEFAULT '' NOT NULL,
	`key_metrics` text DEFAULT '[]' NOT NULL,
	`problem` text DEFAULT '' NOT NULL,
	`approach` text DEFAULT '[]' NOT NULL,
	`quote` text DEFAULT '' NOT NULL,
	`quote_attribution` text DEFAULT '' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);--> statement-breakpoint
CREATE INDEX `projects_status_idx` ON `projects` (`status`);--> statement-breakpoint
CREATE TABLE `reel_clips` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`client_id` text,
	`duration` text DEFAULT '' NOT NULL,
	`category` text DEFAULT 'Social cut' NOT NULL,
	`file_url` text,
	`poster_url` text,
	`position` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'hidden' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`title` text DEFAULT 'Team' NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);