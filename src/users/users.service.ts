import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { Database, DRIZZLE } from "src/db";
import { users } from "src/db/users";
import { User } from "src/shared/interfaces";
import { CustomLogger } from "src/shared/utils/custom-logger";
import * as bcrypt from "bcrypt";
import { usersToPermissions } from "src/db/users-to-permissions";
import { Permission, permissions } from "src/db/permissions";
import { NewStudentDetails, studentDetails } from "src/db/student-details";
import { adminDetails, NewAdminDetails } from "src/db/admin-details";
import { AdminPermissions } from "src/shared/constants/admin-permissions";

@Injectable()
export class UsersService {
  private readonly logger = new CustomLogger(UsersService.name);
  constructor(
    @Inject(DRIZZLE)
    private readonly drizzle: Database,
  ) {}

  async findByEmail(
    email: string,
    extras: {
      permissions?: boolean;
      details?: boolean;
      password?: boolean;
      role?: User["role"];
    } = {
      permissions: true,
      details: true,
      password: false,
      role: null,
    },
  ): Promise<User | null> {
    try {
      const {
        permissions: withPermissions,
        details: withDetails,
        password: withPassword,
        role,
      } = extras;
      if (!role && withDetails) {
        throw new Error("Role is required when details are requested");
      }
      const user = await this.drizzle.query.users.findFirst({
        where: eq(users.email, email),
        with: {
          ...(withPermissions
            ? {
                usersToPermissions: {
                  columns: {
                    permissionId: false,
                    userId: false,
                  },
                  with: {
                    permission: {
                      columns: {
                        name: true,
                      },
                    },
                  },
                },
              }
            : {}),
          ...(withDetails
            ? {
                ...(role === "student"
                  ? {
                      studentDetails: {
                        columns: {
                          firstName: true,
                          lastName: true,
                          address: true,
                          city: true,
                          state: true,
                          zipCode: true,
                          country: true,
                          dateOfBirth: true,
                          gender: true,
                          middleName: true,
                          nationality: true,
                          phoneNumber: true,
                          studentId: true,
                        },
                      },
                    }
                  : {}),
                ...(role === "admin" || role === "super-admin"
                  ? {
                      adminDetails: {
                        columns: {
                          firstName: true,
                          lastName: true,
                        },
                      },
                    }
                  : {}),
              }
            : {}),
        },
      });
      const permissions =
        user?.usersToPermissions?.map(p => p.permission.name) ?? [];
      const details =
        user?.role === "student"
          ? {
              ...user?.studentDetails,
              id: undefined,
              userId: undefined,
            }
          : user?.role === "admin" || user?.role === "super-admin"
            ? {
                firstName: user?.adminDetails?.firstName,
                lastName: user?.adminDetails?.lastName,
              }
            : null;
      return user
        ? {
            id: user.id,
            email: user.email,
            role: user.role,
            password: withPassword ? user.password : undefined,
            details: withDetails ? details : null,
            permissions: withPermissions ? permissions : null,
          }
        : null;
    } catch (error) {
      this.logger.error(`Error finding user by email: ${error}`);
      return null;
    }
  }

  async updateUserPassword(email: string, password: string) {
    try {
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.drizzle
          .update(users)
          .set({
            password: hashedPassword,
          })
          .where(eq(users.email, email));
      }
    } catch (error) {
      this.logger.error(`Error updating user password: ${error}`);
    }
  }

  async getPermissions(): Promise<Permission[]> {
    try {
      const permissions = await this.drizzle.query.permissions.findMany({
        columns: {
          id: true,
          name: true,
        },
      });
      return permissions;
    } catch (error) {
      this.logger.error(`Error getting permissions: ${error}`);
      return [];
    }
  }

  async createPermissions(): Promise<void> {
    try {
      const existingPermissions = await this.getPermissions();
      const permissionsToCreate = Object.values(AdminPermissions)
        .map(p => ({
          name: p,
        }))
        .filter(p => !existingPermissions.find(e => e.name === p.name));
      if (permissionsToCreate.length > 0) {
        await this.drizzle.insert(permissions).values(permissionsToCreate);
        this.logger.log(
          `${permissionsToCreate.length} new permissions created`,
        );
      }
    } catch (error) {
      this.logger.error(`Error creating permissions: ${error}`);
    }
  }

  async syncUserPermissions(
    email: string,
    permissions: string[],
  ): Promise<void> {
    try {
      const permissionsList = await this.getPermissions();
      const permissionsToAssign = permissionsList.filter(p =>
        permissions.includes(p.name),
      );
      const existingUser = await this.findByEmail(email, {
        permissions: true,
        details: false,
      });
      if (existingUser) {
        await this.drizzle.transaction(async tx => {
          tx.delete(usersToPermissions).where(
            eq(usersToPermissions.userId, BigInt(existingUser.id)),
          );
          await tx.insert(usersToPermissions).values(
            permissionsToAssign.map(permission => ({
              userId: BigInt(existingUser.id),
              permissionId: BigInt(permission.id),
            })),
          );
        });
        return;
      } else {
        this.logger.warn(
          `User not found: ${email}. Skipping permissions assignment...`,
        );
      }
    } catch (error) {
      this.logger.error(`Error assigning permissions: ${error}`);
    }
  }

  async createStudentDetails(
    email: string,
    details: Omit<NewStudentDetails, "userId" | "id">,
  ) {
    try {
      const existingUser = await this.findByEmail(email, {
        details: false,
        permissions: false,
      });
      if (!existingUser) {
        this.logger.warn(
          `User not found: ${email}. Skipping details creation...`,
        );
      } else {
        await this.drizzle.insert(studentDetails).values({
          ...details,
          userId: BigInt(existingUser.id),
        });
        this.logger.log(`Student details created: ${email}`);
      }
    } catch (error) {
      this.logger.error(`Error creating user details: ${error}`);
    }
  }

  async updateStudentDetails(
    email: string,
    details: Partial<Omit<NewStudentDetails, "userId" | "id" | "studentId">>,
  ) {
    try {
      const existingUser = await this.findByEmail(email, { role: "student" });
      if (!existingUser) {
        this.logger.warn(
          `User not found: ${email}. Skipping details update...`,
        );
      } else {
        await this.drizzle
          .update(studentDetails)
          .set({
            ...details,
          })
          .where(eq(studentDetails.userId, BigInt(existingUser.id)));
        this.logger.log(`Student details updated: ${email}`);
      }
    } catch (error) {
      this.logger.error(`Error updating user details: ${error}`);
    }
  }

  async createAdminDetails(
    email: string,
    details: Omit<NewAdminDetails, "userId" | "id">,
  ) {
    try {
      const existingUser = await this.findByEmail(email, {
        details: false,
        permissions: false,
      });
      if (!existingUser) {
        this.logger.warn(
          `User not found: ${email}. Skipping details creation...`,
        );
      } else {
        await this.drizzle.insert(adminDetails).values({
          ...details,
          userId: BigInt(existingUser.id),
        });
        this.logger.log(`Admin details created: ${email}`);
      }
    } catch (error) {
      this.logger.error(`Error creating user details: ${error}`);
    }
  }

  async updateAdminDetails(
    email: string,
    details: Partial<Omit<NewAdminDetails, "userId" | "id">>,
  ) {
    try {
      const existingUser = await this.findByEmail(email, { role: "admin" });
      if (!existingUser) {
        this.logger.warn(
          `User not found: ${email}. Skipping details update...`,
        );
      } else {
        await this.drizzle
          .update(adminDetails)
          .set({
            ...details,
          })
          .where(eq(adminDetails.userId, BigInt(existingUser.id)));
        this.logger.log(`Admin details updated: ${email}`);
      }
    } catch (error) {
      this.logger.error(`Error updating user details: ${error}`);
    }
  }

  async createSuperAdmin(email: string, password: string): Promise<void> {
    try {
      const existingUser = await this.findByEmail(email, {
        details: false,
        permissions: false,
      });
      if (existingUser && existingUser.role === "super-admin") {
        this.logger.log(`Super admin already exists: ${email}. Skipping...`);
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.drizzle.insert(users).values({
          email,
          password: hashedPassword,
          role: "super-admin",
        });
        await this.createAdminDetails(email, {
          firstName: "Super",
          lastName: "Admin",
        });
        await this.syncUserPermissions(email, [AdminPermissions.SUPER_ADMIN]);
        this.logger.log(`Super admin created: ${email}`);
      }
    } catch (error) {
      this.logger.error(`Error creating super admin: ${error}`);
    }
  }
}
