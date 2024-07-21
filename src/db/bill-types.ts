import { relations } from "drizzle-orm";
import {
  bigint,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { bills } from "./bills";
import { financialAidDiscounts } from "./financial-aid-discounts";
import { programmes } from "./programmes";

export const billTypes = mysqlTable("bill_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  programmeId: bigint("programme_id", { mode: "bigint", unsigned: true })
    .references(() => programmes.id, { onDelete: "restrict" })
    .notNull(),
});

export const billTypesRelations = relations(billTypes, ({ one, many }) => ({
  programme: one(programmes, {
    fields: [billTypes.programmeId],
    references: [programmes.id],
  }),
  bills: many(bills),
  discounts: many(financialAidDiscounts),
}));

export type BillType = typeof billTypes.$inferSelect;
export type NewBillType = typeof billTypes.$inferInsert;
