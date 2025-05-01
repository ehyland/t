ALTER TABLE `account` ADD `updatedAt` text NOT NULL;--> statement-breakpoint
ALTER TABLE `password` ADD `updatedAt` text NOT NULL;--> statement-breakpoint
ALTER TABLE `password` ADD `salt` text NOT NULL;--> statement-breakpoint
ALTER TABLE `password` ADD `hash` text NOT NULL;