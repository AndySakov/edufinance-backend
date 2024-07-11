CREATE TABLE `admin_details` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`first_name` varchar(128) NOT NULL,
	`last_name` varchar(128) NOT NULL,
	CONSTRAINT `admin_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `applications_to_discounts` (
	`application_id` bigint unsigned NOT NULL,
	`discount_id` bigint unsigned NOT NULL
);
--> statement-breakpoint
CREATE TABLE `bill_types` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `bill_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bills` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`amount_due` decimal(10,2) NOT NULL,
	`due_date` datetime NOT NULL,
	`installment_supported` boolean NOT NULL,
	`max_installments` int NOT NULL,
	`remaining_installments` bigint unsigned NOT NULL,
	`bill_type_id` bigint unsigned NOT NULL,
	`payee_id` bigint unsigned NOT NULL,
	`paid_in_full` boolean NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `bills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `financial_aid_applications` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`applicant_id` bigint unsigned NOT NULL,
	`type_id` bigint unsigned NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL,
	`start_date` date NOT NULL,
	`end_date` date NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `financial_aid_applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `financial_aid_discounts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`bill_type_id` bigint unsigned NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `financial_aid_discounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `financial_aid_types` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `financial_aid_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payment_types` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `payment_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`bill_id` bigint unsigned NOT NULL,
	`payer_id` bigint unsigned NOT NULL,
	`payment_type_id` bigint unsigned NOT NULL,
	`payment_reference` varchar(128) NOT NULL,
	`status` enum('pending','paid','failed','refunded') NOT NULL,
	`payment_note` varchar(128),
	`amount` decimal(10,2) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `payments_payment_reference_unique` UNIQUE(`payment_reference`)
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	CONSTRAINT `permissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `programmes` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`programme_id` varchar(128) NOT NULL,
	`name` varchar(128) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `programmes_id` PRIMARY KEY(`id`),
	CONSTRAINT `programmes_programme_id_unique` UNIQUE(`programme_id`)
);
--> statement-breakpoint
CREATE TABLE `receipts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`payment_id` bigint unsigned NOT NULL,
	`payee_id` bigint unsigned NOT NULL,
	`receipt_id` varchar(128) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `receipts_id` PRIMARY KEY(`id`),
	CONSTRAINT `receipts_receipt_id_unique` UNIQUE(`receipt_id`)
);
--> statement-breakpoint
CREATE TABLE `refunds` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`payment_id` bigint unsigned NOT NULL,
	`payee_id` bigint unsigned NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`reason` varchar(128) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `refunds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student_details` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`student_id` varchar(128) NOT NULL,
	`first_name` varchar(128) NOT NULL,
	`last_name` varchar(128) NOT NULL,
	`middle_name` varchar(128),
	`gender` enum('male','female') NOT NULL,
	`nationality` varchar(128) NOT NULL,
	`date_of_birth` date NOT NULL,
	`phone_number` varchar(128) NOT NULL,
	`address` varchar(128) NOT NULL,
	`city` varchar(128) NOT NULL,
	`state` varchar(128) NOT NULL,
	`zip_code` varchar(128) NOT NULL,
	`country` varchar(128) NOT NULL,
	CONSTRAINT `student_details_id` PRIMARY KEY(`id`),
	CONSTRAINT `student_details_student_id_unique` UNIQUE(`student_id`)
);
--> statement-breakpoint
CREATE TABLE `students_to_programmes` (
	`student_id` bigint unsigned NOT NULL,
	`programme_id` bigint unsigned NOT NULL,
	CONSTRAINT `students_to_programmes_student_id_programme_id_pk` PRIMARY KEY(`student_id`,`programme_id`)
);
--> statement-breakpoint
CREATE TABLE `support_ticket_categories` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `support_ticket_categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `support_tickets` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(128) NOT NULL,
	`description` varchar(128) NOT NULL,
	`category_id` bigint unsigned NOT NULL,
	`handler_id` bigint unsigned NOT NULL,
	`status` enum('pending','active','resolved') NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `support_tickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(128) NOT NULL,
	`password` varchar(128) NOT NULL,
	`role` enum('admin','student','super-admin') NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users_to_permissions` (
	`user_id` bigint unsigned NOT NULL,
	`permission_id` bigint unsigned NOT NULL,
	CONSTRAINT `users_to_permissions_user_id_permission_id_pk` PRIMARY KEY(`user_id`,`permission_id`)
);
--> statement-breakpoint
ALTER TABLE `admin_details` ADD CONSTRAINT `admin_details_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `applications_to_discounts` ADD CONSTRAINT `fk_applications_to_discounts_application_id` FOREIGN KEY (`application_id`) REFERENCES `financial_aid_applications`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `applications_to_discounts` ADD CONSTRAINT `fk_applications_to_discounts_discount_id` FOREIGN KEY (`discount_id`) REFERENCES `financial_aid_discounts`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `bills` ADD CONSTRAINT `bills_bill_type_id_bill_types_id_fk` FOREIGN KEY (`bill_type_id`) REFERENCES `bill_types`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bills` ADD CONSTRAINT `bills_payee_id_users_id_fk` FOREIGN KEY (`payee_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `financial_aid_applications` ADD CONSTRAINT `financial_aid_applications_applicant_id_student_details_id_fk` FOREIGN KEY (`applicant_id`) REFERENCES `student_details`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `financial_aid_applications` ADD CONSTRAINT `financial_aid_applications_type_id_financial_aid_types_id_fk` FOREIGN KEY (`type_id`) REFERENCES `financial_aid_types`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `financial_aid_discounts` ADD CONSTRAINT `financial_aid_discounts_bill_type_id_bill_types_id_fk` FOREIGN KEY (`bill_type_id`) REFERENCES `bill_types`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_bill_id_bills_id_fk` FOREIGN KEY (`bill_id`) REFERENCES `bills`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_payer_id_users_id_fk` FOREIGN KEY (`payer_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_payment_type_id_payment_types_id_fk` FOREIGN KEY (`payment_type_id`) REFERENCES `payment_types`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `receipts` ADD CONSTRAINT `receipts_payment_id_payments_id_fk` FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `receipts` ADD CONSTRAINT `receipts_payee_id_users_id_fk` FOREIGN KEY (`payee_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `refunds` ADD CONSTRAINT `refunds_payment_id_payments_id_fk` FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `refunds` ADD CONSTRAINT `refunds_payee_id_users_id_fk` FOREIGN KEY (`payee_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_details` ADD CONSTRAINT `student_details_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `students_to_programmes` ADD CONSTRAINT `students_to_programmes_student_id_student_details_id_fk` FOREIGN KEY (`student_id`) REFERENCES `student_details`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `students_to_programmes` ADD CONSTRAINT `students_to_programmes_programme_id_programmes_id_fk` FOREIGN KEY (`programme_id`) REFERENCES `programmes`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `support_tickets` ADD CONSTRAINT `support_tickets_category_id_support_ticket_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `support_ticket_categories`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `support_tickets` ADD CONSTRAINT `support_tickets_handler_id_users_id_fk` FOREIGN KEY (`handler_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users_to_permissions` ADD CONSTRAINT `users_to_permissions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users_to_permissions` ADD CONSTRAINT `users_to_permissions_permission_id_permissions_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE cascade ON UPDATE no action;