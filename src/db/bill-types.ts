import { relations } from "drizzle-orm";
import { mysqlTable, serial, timestamp, varchar } from "drizzle-orm/mysql-core";
import { bills } from "./bills";
import { financialAidDiscounts } from "./financial-aid-discounts";

export const billTypes = mysqlTable("bill_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const billTypesRelations = relations(billTypes, ({ many }) => ({
  bills: many(bills),
  discounts: many(financialAidDiscounts),
}));

export type BillType = typeof billTypes.$inferSelect;
export type NewBillType = typeof billTypes.$inferInsert;
