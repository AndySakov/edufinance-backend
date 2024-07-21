import {
  boolean,
  datetime,
  decimal,
  bigint,
  mysqlTable,
  serial,
  timestamp,
  int,
  varchar,
} from "drizzle-orm/mysql-core";
import { billTypes } from "./bill-types";
import { relations } from "drizzle-orm";
import { payments } from "./payments";
import { billsToPayees } from "./bills-to-payees";

export const bills = mysqlTable("bills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  amountDue: decimal("amount_due", { precision: 10, scale: 2 })
    .notNull()
    .$type<number>(),
  dueDate: datetime("due_date").notNull(),
  installmentSupported: boolean("installment_supported").notNull(),
  maxInstallments: int("max_installments").notNull(),
  billTypeId: bigint("bill_type_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => billTypes.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const billsRelations = relations(bills, ({ one, many }) => ({
  billType: one(billTypes, {
    fields: [bills.billTypeId],
    references: [billTypes.id],
  }),
  billsToPayees: many(billsToPayees),
  payments: many(payments),
}));

export type Bill = typeof bills.$inferSelect;
export type NewBill = typeof bills.$inferInsert;
