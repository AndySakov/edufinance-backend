import { bigint, mysqlTable, primaryKey } from "drizzle-orm/mysql-core";
import { studentDetails } from "./student-details";
import { programmes } from "./programmes";
import { relations } from "drizzle-orm";

export const studentsToProgrammes = mysqlTable(
  "students_to_programmes",
  {
    studentId: bigint("student_id", { mode: "bigint", unsigned: true })
      .references(() => studentDetails.id, { onDelete: "cascade" })
      .notNull(),
    programmeId: bigint("programme_id", { mode: "bigint", unsigned: true })
      .references(() => programmes.id, { onDelete: "restrict" })
      .notNull(),
  },
  t => ({
    pk: primaryKey({ columns: [t.studentId, t.programmeId] }),
  }),
);

export const studentsToProgrammesRelations = relations(
  studentsToProgrammes,
  ({ one }) => ({
    programme: one(programmes, {
      fields: [studentsToProgrammes.programmeId],
      references: [programmes.id],
    }),
    student: one(studentDetails, {
      fields: [studentsToProgrammes.studentId],
      references: [studentDetails.id],
    }),
  }),
);
