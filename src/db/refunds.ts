import {
  decimal,
  bigint,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { payments } from "./payments";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const refunds = mysqlTable("refunds", {
  id: serial("id").primaryKey(),
  paymentId: bigint("payment_id", { mode: "bigint", unsigned: true })
    .references(() => payments.id, { onDelete: "cascade" })
    .notNull(),
  payeeId: bigint("payee_id", { mode: "bigint", unsigned: true })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  reason: varchar("reason", { length: 128 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const refundsRelations = relations(refunds, ({ one }) => ({
  payment: one(payments, {
    fields: [refunds.paymentId],
    references: [payments.id],
  }),
  payee: one(users, {
    fields: [refunds.payeeId],
    references: [users.id],
  }),
}));

export type Refund = typeof refunds.$inferSelect;
export type NewRefund = typeof refunds.$inferInsert;
