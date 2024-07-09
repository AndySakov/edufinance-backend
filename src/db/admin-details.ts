import {
  bigint,
  int,
  mysqlTable,
  serial,
  varchar,
} from "drizzle-orm/mysql-core";
import { users } from "./users";

export const adminDetails = mysqlTable("admin_details", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "bigint", unsigned: true })
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  firstName: varchar("first_name", { length: 128 }).notNull(),
  lastName: varchar("last_name", { length: 128 }).notNull(),
});

export type AdminDetails = typeof adminDetails.$inferSelect;
export type NewAdminDetails = typeof adminDetails.$inferInsert;
