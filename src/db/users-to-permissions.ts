import { bigint, mysqlTable, primaryKey } from "drizzle-orm/mysql-core";
import { users } from "./users";
import { permissions } from "./permissions";
import { relations } from "drizzle-orm";

export const usersToPermissions = mysqlTable(
  "users_to_permissions",
  {
    userId: bigint("user_id", { mode: "bigint", unsigned: true })
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    permissionId: bigint("permission_id", { mode: "bigint", unsigned: true })
      .references(() => permissions.id, { onDelete: "cascade" })
      .notNull(),
  },
  t => ({
    pk: primaryKey({ columns: [t.userId, t.permissionId] }),
  }),
);

export const usersToPermissionsRelations = relations(
  usersToPermissions,
  ({ one }) => ({
    user: one(users, {
      fields: [usersToPermissions.userId],
      references: [users.id],
    }),
    permission: one(permissions, {
      fields: [usersToPermissions.permissionId],
      references: [permissions.id],
    }),
  }),
);
