import { relations } from "drizzle-orm";
import { mysqlTable, serial, timestamp, varchar } from "drizzle-orm/mysql-core";
import { studentsToProgrammes } from "./students-to-programmes";

export const programmes = mysqlTable("programmes", {
  id: serial("id").primaryKey(),
  programmeId: varchar("programme_id", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const programmesRelations = relations(programmes, ({ many }) => ({
  studentsToProgrammes: many(studentsToProgrammes),
}));

export type Programme = typeof programmes.$inferSelect;
export type NewProgramme = typeof programmes.$inferInsert;
