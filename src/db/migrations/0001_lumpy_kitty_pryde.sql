CREATE TABLE `bills_to_payees` (
	`bill_id` bigint unsigned NOT NULL,
	`payee_id` bigint unsigned NOT NULL,
	CONSTRAINT `bills_to_payees_bill_id_payee_id_pk` PRIMARY KEY(`bill_id`,`payee_id`)
);
--> statement-breakpoint
ALTER TABLE `bills_to_payees` ADD CONSTRAINT `bills_to_payees_bill_id_bills_id_fk` FOREIGN KEY (`bill_id`) REFERENCES `bills`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bills_to_payees` ADD CONSTRAINT `bills_to_payees_payee_id_student_details_id_fk` FOREIGN KEY (`payee_id`) REFERENCES `student_details`(`id`) ON DELETE restrict ON UPDATE no action;