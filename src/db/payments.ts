import { relations } from "drizzle-orm";
import {
  mysqlTable,
  serial,
  varchar,
  decimal,
  timestamp,
  bigint,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { receipts } from "./receipts";
import { bills } from "./bills";
import { paymentTypes } from "./payment-types";
import { refunds } from "./refunds";
import { studentDetails } from "./student-details";

export const payments = mysqlTable("payments", {
  id: serial("id").primaryKey(),
  billId: bigint("bill_id", { mode: "bigint", unsigned: true })
    .references(() => bills.id, { onDelete: "cascade" })
    .notNull(),
  payerId: bigint("payer_id", { mode: "bigint", unsigned: true })
    .references(() => studentDetails.id, { onDelete: "cascade" })
    .notNull(),
  paymentTypeId: bigint("payment_type_id", { mode: "bigint", unsigned: true })
    .references(() => paymentTypes.id, { onDelete: "cascade" })
    .notNull(),
  paymentReference: varchar("payment_reference", { length: 128 })
    .notNull()
    .unique(),
  status: mysqlEnum("status", [
    "pending",
    "paid",
    "failed",
    "refunded",
  ]).notNull(),
  paymentNote: varchar("payment_note", { length: 128 }),
  amount: decimal("amount", { precision: 10, scale: 2 })
    .notNull()
    .$type<number>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  bill: one(bills, {
    fields: [payments.billId],
    references: [bills.id],
  }),
  payer: one(studentDetails, {
    fields: [payments.payerId],
    references: [studentDetails.id],
  }),
  type: one(paymentTypes, {
    fields: [payments.paymentTypeId],
    references: [paymentTypes.id],
  }),
  receipt: one(receipts),
  refunds: many(refunds),
}));

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
