CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` text NOT NULL,
	`email` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `account_email_unique` ON `account` (`email`);--> statement-breakpoint
CREATE TABLE `password` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` text NOT NULL,
	`idAccount` text NOT NULL,
	FOREIGN KEY (`idAccount`) REFERENCES `account`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `password_idAccount_unique` ON `password` (`idAccount`);