import { relations } from "drizzle-orm";
import {
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { studentDetails } from "./student-details";
import { adminDetails } from "./admin-details";
import { usersToPermissions } from "./users-to-permissions";
import { bills } from "./bills";
import { payments } from "./payments";
import { receipts } from "./receipts";
import { refunds } from "./refunds";
import { financialAidApplications } from "./financial-aid-applications";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 128 }).notNull(),
  password: varchar("password", { length: 128 }).notNull(),
  role: mysqlEnum("role", ["admin", "student", "super-admin"]).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  bills: many(bills),
  refunds: many(refunds),
  receipts: many(receipts),
  payments: many(payments),
  adminDetails: one(adminDetails),
  studentDetails: one(studentDetails),
  usersToPermissions: many(usersToPermissions),
  financialAidApplications: many(financialAidApplications),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
