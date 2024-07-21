import { AdminDetails } from "src/db/admin-details";
import { StudentDetails } from "src/db/student-details";
import { User as DBUser } from "src/db/users";

export type User = Omit<DBUser, "password" | "createdAt" | "updatedAt"> & {
  password: string | undefined;
  details:
    | Omit<StudentDetails, "id" | "userId" | "createdAt" | "updatedAt">
    | Omit<AdminDetails, "id" | "userId" | "createdAt" | "updatedAt">
    | null;
  permissions: string[] | null;
  programme: string | null;
};

export type AuthenticatedUser = {
  email: string;
  role: User["role"];
  permissions: User["permissions"];
};
