ALTER TABLE `bills_to_payees` DROP FOREIGN KEY `bills_to_payees_payee_id_student_details_id_fk`;
--> statement-breakpoint
ALTER TABLE `financial_aid_applications` MODIFY COLUMN `has_received_previous_financial_aid` tinyint NOT NULL;--> statement-breakpoint
ALTER TABLE `bills_to_payees` ADD CONSTRAINT `bills_to_payees_payee_id_student_details_id_fk` FOREIGN KEY (`payee_id`) REFERENCES `student_details`(`id`) ON DELETE cascade ON UPDATE no action;