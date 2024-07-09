import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { Database, DRIZZLE } from "src/db";
import { users } from "src/db/users";
import { User } from "src/shared/interfaces";
import { CustomLogger } from "src/shared/utils/custom-logger";

@Injectable()
export class UsersService {
  private readonly logger = new CustomLogger(UsersService.name);
  constructor(
    @Inject(DRIZZLE)
    private readonly drizzle: Database,
  ) {}

  async findByEmail(
    email: string,
    extras: { permissions: boolean; details: boolean } = {
      permissions: true,
      details: true,
    },
  ): Promise<User | null> {
    try {
      const { permissions: withPermissions, details: withDetails } = extras;
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
                studentDetails: {
                  columns: {
                    firstName: true,
                    lastName: true,
                  },
                },
                adminDetails: {
                  columns: {
                    firstName: true,
                    lastName: true,
                  },
                },
              }
            : {}),
        },
      });
      const permissions = user?.usersToPermissions.map(p => p.permission.name);
      const details =
        user?.role === "student"
          ? {
              firstName: user.studentDetails.firstName,
              lastName: user.studentDetails.lastName,
            }
          : user?.role === "admin"
            ? {
                firstName: user.adminDetails.firstName,
                lastName: user.adminDetails.lastName,
              }
            : null;
      return {
        id: user.id,
        email: user.email,
        role: user.role,
        details: withDetails ? details : null,
        permissions: withPermissions ? permissions : null,
      };
    } catch (error) {
      this.logger.error(`Error finding user by email: ${error}`);
      return null;
    }
  }
}
