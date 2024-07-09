import { relations } from "drizzle-orm";
import { mysqlTable, serial, timestamp, varchar } from "drizzle-orm/mysql-core";
import { supportTickets } from "./support-tickets";

export const supportTicketCategories = mysqlTable("support_ticket_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const supportTicketCategoriesRelations = relations(
  supportTicketCategories,
  ({ many }) => ({
    supportTickets: many(supportTickets),
  }),
);

export type SupportTicketCategory = typeof supportTicketCategories.$inferSelect;
export type NewSupportTicketCategory =
  typeof supportTicketCategories.$inferInsert;
