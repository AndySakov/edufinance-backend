import {
  boolean,
  datetime,
  decimal,
  bigint,
  mysqlTable,
  serial,
  timestamp,
  int,
} from "drizzle-orm/mysql-core";
import { billTypes } from "./bill-types";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { payments } from "./payments";

export const bills = mysqlTable("bills", {
  id: serial("id").primaryKey(),
  amountDue: decimal("amount_due", { precision: 10, scale: 2 }).notNull(),
  dueDate: datetime("due_date").notNull(),
  installmentSupported: boolean("installment_supported").notNull(),
  maxInstallments: int("max_installments").notNull(),
  remainingInstallments: bigint("remaining_installments", {
    mode: "bigint",
    unsigned: true,
  }).notNull(),
  billTypeId: bigint("bill_type_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => billTypes.id, { onDelete: "restrict" }),
  payeeId: bigint("payee_id", { mode: "bigint", unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  paidInFull: boolean("paid_in_full").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const billsRelations = relations(bills, ({ one, many }) => ({
  billType: one(billTypes, {
    fields: [bills.billTypeId],
    references: [billTypes.id],
  }),
  payee: one(users, {
    fields: [bills.payeeId],
    references: [users.id],
  }),
  payments: many(payments),
}));

export type Bill = typeof bills.$inferSelect;
export type NewBill = typeof bills.$inferInsert;
