import { Inject, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { Database, DRIZZLE } from "src/db";
import { users } from "src/db/users";
import { MailService } from "src/mail/mail.service";
import { randomToken } from "src/shared/helpers";
import { generateNewAdminEmail } from "src/shared/helpers/email-generators";
import { data } from "src/shared/interfaces";
import { CustomLogger } from "src/shared/utils/custom-logger";
import { UsersService } from "src/users/users.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { UpdatePermissionsDto } from "./dto/update-permissions.dto";

@Injectable()
export class AdminsService {
  private readonly logger = new CustomLogger(AdminsService.name);
  constructor(
    @Inject(DRIZZLE) private readonly drizzle: Database,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    try {
      const defaultPass = randomToken();
      const hashedPassword = await bcrypt.hash(defaultPass, 10);
      await this.drizzle.insert(users).values({
        email: createAdminDto.email,
        password: hashedPassword,
        role: "admin",
      });
      await this.usersService.createAdminDetails(createAdminDto.email, {
        firstName: createAdminDto.firstName,
        lastName: createAdminDto.lastName,
      });
      await this.usersService.syncUserPermissions(
        createAdminDto.email,
        createAdminDto.permissions,
      );
      await this.mailService.sendMail({
        to: createAdminDto.email,
        subject: "New admin account created",
        html: generateNewAdminEmail(
          createAdminDto.firstName,
          createAdminDto.lastName,
          defaultPass,
        ),
      });
      this.logger.log(`Admin created: ${createAdminDto.email}`);
      return {
        success: true,
        message: "Admin created",
      };
    } catch (error) {
      this.logger.error(`Error creating admin: ${error}`);
      return {
        success: false,
        message: "Error creating admin",
      };
    }
  }

  async findAll() {
    try {
      const users = await this.drizzle.query.users.findMany({
        with: {
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
          adminDetails: {
            columns: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      return {
        success: true,
        message: "Admins found",
        data: users.map(user => {
          const permissions = user?.usersToPermissions.map(
            p => p.permission.name,
          );
          const details = {
            firstName: user.adminDetails.firstName,
            lastName: user.adminDetails.lastName,
          };
          return {
            id: user.id,
            email: user.email,
            role: user.role,
            details: details,
            permissions: permissions,
          };
        }),
      };
    } catch (error) {
      this.logger.error(`Error finding all admins: ${error}`);
      return {
        success: false,
        message: "Error finding admins",
      };
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.drizzle.query.users.findFirst({
        where: eq(users.id, id),
        with: {
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
          adminDetails: {
            columns: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      if (user) {
        const permissions = user?.usersToPermissions.map(
          p => p.permission.name,
        );
        const details = {
          firstName: user.adminDetails.firstName,
          lastName: user.adminDetails.lastName,
        };
        return {
          success: true,
          message: "Admin found",
          data: {
            id: user.id,
            email: user.email,
            role: user.role,
            details: details,
            permissions: permissions,
          },
        };
      } else {
        return {
          success: false,
          message: "Admin not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error finding admin: ${error}`);
      return {
        success: false,
        message: "Error finding admin",
      };
    }
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    try {
      const existingUser = data(await this.findOne(id));
      if (existingUser) {
        await this.usersService.updateAdminDetails(existingUser.email, {
          firstName: updateAdminDto.firstName,
          lastName: updateAdminDto.lastName,
        });
        await this.usersService.syncUserPermissions(
          existingUser.email,
          updateAdminDto.permissions,
        );
      } else {
        return {
          success: false,
          message: "Admin not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error updating admin: ${error}`);
      return {
        success: false,
        message: "Error updating admin",
      };
    }
  }

  async updatePermissions(
    id: number,
    updatePermissionsDto: UpdatePermissionsDto,
  ) {
    try {
      const existingUser = data(await this.findOne(id));
      if (existingUser) {
        await this.usersService.syncUserPermissions(
          existingUser.email,
          updatePermissionsDto.permissions,
        );
      } else {
        return {
          success: false,
          message: "Admin not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error updating admin permissions: ${error}`);
      return {
        success: false,
        message: "Error updating admin permissions",
      };
    }
  }

  async remove(id: number) {
    try {
      const existingUser = data(await this.findOne(id));
      if (existingUser) {
        await this.drizzle.delete(users).where(eq(users.id, id));
        this.logger.log(`Admin removed: ${existingUser.email}`);
      } else {
        return {
          success: false,
          message: "Admin not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error removing admin: ${error}`);
      return {
        success: false,
        message: "Error removing admin",
      };
    }
  }
}
