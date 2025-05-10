CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`email` text NOT NULL,
	`emailVerified` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `account_email_unique` ON `account` (`email`);--> statement-breakpoint
CREATE TABLE `oneTimeCode` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`code` text NOT NULL,
	`used` integer DEFAULT false NOT NULL,
	`purpose` text,
	`idAccount` text NOT NULL,
	FOREIGN KEY (`idAccount`) REFERENCES `account`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `oneTimeCode_idAccount_unique` ON `oneTimeCode` (`idAccount`);--> statement-breakpoint
CREATE TABLE `password` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`salt` text NOT NULL,
	`hash` text NOT NULL,
	`idAccount` text NOT NULL,
	FOREIGN KEY (`idAccount`) REFERENCES `account`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `password_idAccount_unique` ON `password` (`idAccount`);