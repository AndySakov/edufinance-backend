import {
  bigint,
  decimal,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { billTypes } from "./bill-types";
import { relations } from "drizzle-orm";
import { applicationsToDiscounts } from "./applications-to-discounts";

export const financialAidDiscounts = mysqlTable("financial_aid_discounts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  billTypeId: bigint("bill_type_id", { mode: "bigint", unsigned: true })
    .references(() => billTypes.id, { onDelete: "cascade" })
    .notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const financialAidDiscountsRelations = relations(
  financialAidDiscounts,
  ({ one, many }) => ({
    billType: one(billTypes, {
      fields: [financialAidDiscounts.billTypeId],
      references: [billTypes.id],
    }),
    applications: many(applicationsToDiscounts),
  }),
);

export type FinancialAidDiscount = typeof financialAidDiscounts.$inferSelect;
export type NewFinancialAidDiscount = typeof financialAidDiscounts.$inferInsert;
