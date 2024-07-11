import { bigint, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const adminDetails = mysqlTable("admin_details", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "bigint", unsigned: true })
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  firstName: varchar("first_name", { length: 128 }).notNull(),
  lastName: varchar("last_name", { length: 128 }).notNull(),
});

export const adminDetailsRelations = relations(adminDetails, ({ one }) => ({
  user: one(users, {
    fields: [adminDetails.userId],
    references: [users.id],
  }),
}));

export type AdminDetails = typeof adminDetails.$inferSelect;
export type NewAdminDetails = typeof adminDetails.$inferInsert;
