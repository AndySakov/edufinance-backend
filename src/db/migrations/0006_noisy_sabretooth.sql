ALTER TABLE `financial_aid_applications` DROP FOREIGN KEY `financial_aid_applications_applicant_id_student_details_id_fk`;
--> statement-breakpoint
ALTER TABLE `financial_aid_applications` DROP FOREIGN KEY `financial_aid_applications_type_id_financial_aid_types_id_fk`;
--> statement-breakpoint
ALTER TABLE `financial_aid_applications` ADD CONSTRAINT `financial_aid_applications_applicant_id_student_details_id_fk` FOREIGN KEY (`applicant_id`) REFERENCES `student_details`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `financial_aid_applications` ADD CONSTRAINT `financial_aid_applications_type_id_financial_aid_types_id_fk` FOREIGN KEY (`type_id`) REFERENCES `financial_aid_types`(`id`) ON DELETE cascade ON UPDATE no action;