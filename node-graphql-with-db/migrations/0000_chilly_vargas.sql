CREATE TABLE `channel_sequences` (
	`channel` text PRIMARY KEY NOT NULL,
	`nextSequence` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `message` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` text NOT NULL,
	`sequence` integer NOT NULL,
	`channel` text NOT NULL,
	`content` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_unique_channel_sequence` ON `message` (`channel`,`sequence`);