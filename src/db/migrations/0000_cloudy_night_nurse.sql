CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`done` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT '"2025-02-03T11:02:23.521Z"',
	`updated_at` integer DEFAULT '"2025-02-03T11:02:23.521Z"'
);
