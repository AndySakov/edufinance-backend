import { AdminDetails } from "src/db/admin-details";
import { StudentDetails } from "src/db/student-details";
import { User as DBUser } from "src/db/users";

export type User = Omit<DBUser, "password" | "createdAt" | "updatedAt"> & {
  details:
    | Omit<StudentDetails, "id" | "userId" | "createdAt" | "updatedAt">
    | Omit<AdminDetails, "id" | "userId" | "createdAt" | "updatedAt">
    | null;
  permissions: string[] | null;
};
