import { bigint, mysqlTable, primaryKey } from "drizzle-orm/mysql-core";
import { studentDetails } from "./student-details";
import { relations } from "drizzle-orm";
import { bills } from "./bills";

export const billsToPayees = mysqlTable(
  "bills_to_payees",
  {
    billId: bigint("bill_id", { mode: "bigint", unsigned: true })
      .references(() => bills.id, { onDelete: "cascade" })
      .notNull(),
    payeeId: bigint("payee_id", { mode: "bigint", unsigned: true })
      .references(() => studentDetails.id, { onDelete: "restrict" })
      .notNull(),
  },
  t => ({
    pk: primaryKey({ columns: [t.billId, t.payeeId] }),
  }),
);

export const billsToPayeesRelations = relations(billsToPayees, ({ one }) => ({
  bill: one(bills, {
    fields: [billsToPayees.billId],
    references: [bills.id],
  }),
  payee: one(studentDetails, {
    fields: [billsToPayees.payeeId],
    references: [studentDetails.id],
  }),
}));
