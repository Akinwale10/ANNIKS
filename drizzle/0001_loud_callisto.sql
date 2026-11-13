CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(32) NOT NULL,
	`customerName` varchar(160) NOT NULL,
	`customerPhone` varchar(40) NOT NULL,
	`deliveryAddress` text NOT NULL,
	`items` text NOT NULL,
	`total` int NOT NULL,
	`status` enum('pending','confirmed','processing','dispatched','completed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(160) NOT NULL,
	`name` varchar(160) NOT NULL,
	`category` enum('Food','Shades','Perfumes') NOT NULL,
	`description` text NOT NULL,
	`price` int NOT NULL,
	`stock` int NOT NULL DEFAULT 0,
	`imageUrl` varchar(500) NOT NULL,
	`badge` varchar(80),
	`active` boolean NOT NULL DEFAULT true,
	`featured` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
