import { relations } from "drizzle-orm";
import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
import { usersToPermissions } from "./users-to-permissions";

export const permissions = mysqlTable("permissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
});

export const permissionsRelations = relations(permissions, ({ many }) => ({
  usersToPermissions: many(usersToPermissions),
}));

export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;
