import {
  bigint,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { payments } from "./payments";
import { relations } from "drizzle-orm";
import { studentDetails } from "./student-details";

export const receipts = mysqlTable("receipts", {
  id: serial("id").primaryKey(),
  paymentId: bigint("payment_id", { mode: "bigint", unsigned: true })
    .references(() => payments.id, { onDelete: "cascade" })
    .notNull(),
  payeeId: bigint("payee_id", { mode: "bigint", unsigned: true })
    .references(() => studentDetails.id, { onDelete: "cascade" })
    .notNull(),
  receiptId: varchar("receipt_id", { length: 128 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const receiptsRelations = relations(receipts, ({ one }) => ({
  payment: one(payments, {
    fields: [receipts.paymentId],
    references: [payments.id],
  }),
  payee: one(studentDetails, {
    fields: [receipts.payeeId],
    references: [studentDetails.id],
  }),
}));

export type Receipt = typeof receipts.$inferSelect;
export type NewReceipt = typeof receipts.$inferInsert;
