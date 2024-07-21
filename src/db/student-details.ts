import {
  date,
  bigint,
  mysqlEnum,
  mysqlTable,
  serial,
  varchar,
} from "drizzle-orm/mysql-core";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { studentsToProgrammes } from "./students-to-programmes";
import { bills } from "./bills";
import { financialAidApplications } from "./financial-aid-applications";
import { payments } from "./payments";
import { receipts } from "./receipts";
import { refunds } from "./refunds";

export const studentDetails = mysqlTable("student_details", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "bigint", unsigned: true })
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  studentId: varchar("student_id", { length: 128 }).notNull().unique(),
  firstName: varchar("first_name", { length: 128 }).notNull(),
  lastName: varchar("last_name", { length: 128 }).notNull(),
  middleName: varchar("middle_name", { length: 128 }),
  gender: mysqlEnum("gender", ["male", "female"]).notNull(),
  nationality: varchar("nationality", { length: 128 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  phoneNumber: varchar("phone_number", { length: 128 }).notNull(),
  address: varchar("address", { length: 128 }).notNull(),
  city: varchar("city", { length: 128 }).notNull(),
  state: varchar("state", { length: 128 }).notNull(),
  zipCode: varchar("zip_code", { length: 128 }).notNull(),
  country: varchar("country", { length: 128 }).notNull(),
});

export const studentDetailsRelations = relations(
  studentDetails,
  ({ one, many }) => ({
    user: one(users, {
      fields: [studentDetails.userId],
      references: [users.id],
    }),
    bills: many(bills),
    refunds: many(refunds),
    receipts: many(receipts),
    payments: many(payments),
    financialAidApplications: many(financialAidApplications),
    studentsToProgrammes: many(studentsToProgrammes),
  }),
);

export type StudentDetails = typeof studentDetails.$inferSelect;
export type NewStudentDetails = typeof studentDetails.$inferInsert;
