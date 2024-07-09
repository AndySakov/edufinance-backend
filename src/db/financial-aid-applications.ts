import {
  date,
  bigint,
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
} from "drizzle-orm/mysql-core";
import { studentDetails } from "./student-details";
import { financialAidTypes } from "./financial-aid-types";
import { relations } from "drizzle-orm";
import { applicationsToDiscounts } from "./applications-to-discounts";

export const financialAidApplications = mysqlTable(
  "financial_aid_applications",
  {
    id: serial("id").primaryKey(),
    applicantId: bigint("applicant_id", { mode: "bigint", unsigned: true })
      .references(() => studentDetails.id)
      .notNull(),
    typeId: bigint("type_id", { mode: "bigint", unsigned: true })
      .references(() => financialAidTypes.id, { onDelete: "restrict" })
      .notNull(),
    status: mysqlEnum("status", ["pending", "approved", "rejected"]).notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
);

export const financialAidApplicationsRelations = relations(
  financialAidApplications,
  ({ one, many }) => ({
    applicant: one(studentDetails, {
      fields: [financialAidApplications.applicantId],
      references: [studentDetails.id],
    }),
    type: one(financialAidTypes, {
      fields: [financialAidApplications.typeId],
      references: [financialAidTypes.id],
    }),
    applicationsToDiscounts: many(applicationsToDiscounts),
  }),
);

export type FinancialAidApplication =
  typeof financialAidApplications.$inferSelect;
export type NewFinancialAidApplication =
  typeof financialAidApplications.$inferInsert;
