import { relations } from "drizzle-orm";
import { mysqlTable, serial, timestamp, varchar } from "drizzle-orm/mysql-core";
import { payments } from "./payments";

export const paymentTypes = mysqlTable("payment_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const paymentTypesRelations = relations(paymentTypes, ({ many }) => ({
  payments: many(payments),
}));

export type PaymentType = typeof paymentTypes.$inferSelect;
export type NewPaymentType = typeof paymentTypes.$inferInsert;
