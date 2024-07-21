import {
  bigint,
  decimal,
  foreignKey,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { billTypes } from "./bill-types";
import { relations } from "drizzle-orm";
import { financialAidTypes } from "./financial-aid-types";

export const financialAidDiscounts = mysqlTable(
  "financial_aid_discounts",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 128 }).notNull(),
    billTypeId: bigint("bill_type_id", { mode: "bigint", unsigned: true })
      .references(() => billTypes.id, { onDelete: "cascade" })
      .notNull(),
    financialAidTypeId: bigint("financial_aid_type_id", {
      mode: "bigint",
      unsigned: true,
    }).notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 })
      .notNull()
      .$type<number>(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  table => {
    return {
      financialAidTypeReference: foreignKey({
        columns: [table.financialAidTypeId],
        foreignColumns: [financialAidTypes.id],
        name: "fk_financial_aid_discounts_financial_aid_type_id",
      })
        .onDelete("cascade")
        .onUpdate("cascade"),
    };
  },
);

export const financialAidDiscountsRelations = relations(
  financialAidDiscounts,
  ({ one }) => ({
    billType: one(billTypes, {
      fields: [financialAidDiscounts.billTypeId],
      references: [billTypes.id],
    }),
    financialAidType: one(financialAidTypes, {
      fields: [financialAidDiscounts.financialAidTypeId],
      references: [financialAidTypes.id],
    }),
  }),
);

export type FinancialAidDiscount = typeof financialAidDiscounts.$inferSelect;
export type NewFinancialAidDiscount = typeof financialAidDiscounts.$inferInsert;
