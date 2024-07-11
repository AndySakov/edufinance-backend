import {
  bigint,
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { supportTicketCategories } from "./support-ticket-categories";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const supportTickets = mysqlTable("support_tickets", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 128 }).notNull(),
  description: varchar("description", { length: 128 }).notNull(),
  categoryId: bigint("category_id", { mode: "bigint", unsigned: true })
    .references(() => supportTicketCategories.id, { onDelete: "restrict" })
    .notNull(),
  handlerId: bigint("handler_id", {
    mode: "bigint",
    unsigned: true,
  }).references(() => users.id, {
    onDelete: "set null",
  }),
  inquirerId: bigint("handler_id", { mode: "bigint", unsigned: true })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  status: mysqlEnum("status", ["pending", "active", "resolved"]).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const supportTicketsRelations = relations(supportTickets, ({ one }) => ({
  category: one(supportTicketCategories, {
    fields: [supportTickets.categoryId],
    references: [supportTicketCategories.id],
  }),
  handler: one(users, {
    fields: [supportTickets.handlerId],
    references: [users.id],
  }),
  inquirer: one(users, {
    fields: [supportTickets.inquirerId],
    references: [users.id],
  }),
}));

export type SupportTicket = typeof supportTickets.$inferSelect;
export type NewSupportTicket = typeof supportTickets.$inferInsert;
