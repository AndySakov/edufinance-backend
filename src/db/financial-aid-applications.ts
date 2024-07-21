import {
  date,
  bigint,
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
  decimal,
  varchar,
  tinyint,
} from "drizzle-orm/mysql-core";
import { studentDetails } from "./student-details";
import { financialAidTypes } from "./financial-aid-types";
import { relations } from "drizzle-orm";

export const financialAidApplications = mysqlTable(
  "financial_aid_applications",
  {
    id: serial("id").primaryKey(),
    applicantId: bigint("applicant_id", { mode: "bigint", unsigned: true })
      .references(() => studentDetails.id)
      .notNull(),
    typeId: bigint("type_id", { mode: "bigint", unsigned: true }).references(
      () => financialAidTypes.id,
      { onDelete: "restrict" },
    ),
    status: mysqlEnum("status", ["pending", "approved", "rejected"]).notNull(),
    householdIncome: decimal("household_income", { precision: 10, scale: 2 })
      .notNull()
      .$type<number>(),
    hasReceivedPreviousFinancialAid: tinyint(
      "has_received_previous_financial_aid",
    ).notNull(),
    bankStatementUrl: varchar("bank_statement_url", { length: 128 }).notNull(),
    coverLetterUrl: varchar("cover_letter_url", { length: 128 }).notNull(),
    letterOfRecommendationUrl: varchar("letter_of_recommendation_url", {
      length: 128,
    }).notNull(),
    startDate: date("start_date"),
    endDate: date("end_date"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
);

export const financialAidApplicationsRelations = relations(
  financialAidApplications,
  ({ one }) => ({
    applicant: one(studentDetails, {
      fields: [financialAidApplications.applicantId],
      references: [studentDetails.id],
    }),
    type: one(financialAidTypes, {
      fields: [financialAidApplications.typeId],
      references: [financialAidTypes.id],
    }),
  }),
);

export type FinancialAidApplication =
  typeof financialAidApplications.$inferSelect;
export type NewFinancialAidApplication =
  typeof financialAidApplications.$inferInsert;
