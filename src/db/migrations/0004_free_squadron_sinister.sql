ALTER TABLE `financial_aid_applications` MODIFY COLUMN `start_date` date;--> statement-breakpoint
ALTER TABLE `financial_aid_applications` MODIFY COLUMN `end_date` date;--> statement-breakpoint
ALTER TABLE `financial_aid_applications` ADD `household_income` decimal(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `financial_aid_applications` ADD `has_received_previous_financial_aid` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `financial_aid_applications` ADD `bank_statement_url` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `financial_aid_applications` ADD `cover_letter_url` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `financial_aid_applications` ADD `letter_of_recommendation_url` varchar(128) NOT NULL;