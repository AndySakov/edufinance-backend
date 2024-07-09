import { relations } from "drizzle-orm";
import { mysqlTable, serial, timestamp, varchar } from "drizzle-orm/mysql-core";
import { financialAidApplications } from "./financial-aid-applications";

export const financialAidTypes = mysqlTable("financial_aid_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const financialAidTypesRelations = relations(
  financialAidTypes,
  ({ many }) => ({
    financialAidApplications: many(financialAidApplications),
  }),
);

export type FinancialAidType = typeof financialAidTypes.$inferSelect;
export type NewFinancialAidType = typeof financialAidTypes.$inferInsert;
