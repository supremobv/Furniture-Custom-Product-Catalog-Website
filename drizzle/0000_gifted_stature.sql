CREATE TABLE `custom_inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`location` text NOT NULL,
	`product_id` text NOT NULL,
	`material` text NOT NULL,
	`finish` text NOT NULL,
	`quantity` integer NOT NULL,
	`dimensions` text NOT NULL,
	`budget` text NOT NULL,
	`timeline` text NOT NULL,
	`message` text NOT NULL,
	`estimate` integer,
	`status` text DEFAULT 'New' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `custom_inquiries_reference_unique` ON `custom_inquiries` (`reference`);