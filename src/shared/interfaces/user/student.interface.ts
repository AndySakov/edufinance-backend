import { StudentDetails } from "src/db/student-details";
import { User } from "./user.interface";

export type Student = Omit<
  User,
  "password" | "createdAt" | "updatedAt" | "details"
> & {
  details: Omit<StudentDetails, "id" | "userId" | "createdAt" | "updatedAt">;
};
