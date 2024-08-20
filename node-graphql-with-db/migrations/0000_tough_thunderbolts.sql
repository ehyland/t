CREATE TABLE `message` (
	`id` text PRIMARY KEY NOT NULL,
	`completedAt` text NOT NULL,
	`content` text NOT NULL,
	`sequence` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sequence` (
	`id` text PRIMARY KEY NOT NULL,
	`completedAt` text NOT NULL,
	`partitionKey` text NOT NULL,
	`lastUsedSequence` integer NOT NULL
);
