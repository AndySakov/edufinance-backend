import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { Database, DRIZZLE } from "src/db";
import { users } from "src/db/users";
import {
  ResponseWithNoData,
  ResponseWithOptionalData,
  User,
} from "src/shared/interfaces";
import { LoginDto } from "./dto/login.dto";
import { CustomLogger } from "src/shared/utils/custom-logger";
import { UsersService } from "src/users/users.service";
import { UpdatePasswordDto } from "./dto/update-password.dto";

@Injectable()
export class AuthService {
  private readonly jwtConfig: object;
  private readonly logger = new CustomLogger(AuthService.name);
  constructor(
    @Inject(DRIZZLE)
    private readonly drizzle: Database,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    this.jwtConfig = {
      secret: this.configService.get<string>("JWT_SECRET"),
      mutatePayload: false,
    };
  }

  async login(body: LoginDto): Promise<
    ResponseWithOptionalData<
      Omit<User, "password" | "createdAt" | "updatedAt"> & {
        token: string;
        permissions: string[];
      }
    >
  > {
    const user = await this.drizzle.query.users.findFirst({
      where: eq(users.email, body.email),
      columns: {
        id: false,
        email: true,
        password: true,
        role: true,
      },
    });
    if (user.email) {
      const isValid = await this.validatePassword(user.password, body.password);
      if (isValid) {
        const userWithDetails = await this.usersService.findByEmail(
          body.email,
          {
            permissions: true,
            details: true,
            role: user?.role === "super-admin" ? "admin" : user?.role,
          },
        );
        return {
          success: true,
          message: "Login successful",
          data: {
            ...userWithDetails,
            token: this.createToken({
              email: user.email,
              role: user.role,
              permissions: userWithDetails?.permissions ?? [],
            }),
          },
        };
      } else {
        return { success: false, message: "Invalid credentials" };
      }
    } else {
      return { success: false, message: "Invalid credentials" };
    }
  }

  async updatePassword(
    email: string,
    body: UpdatePasswordDto,
  ): Promise<ResponseWithNoData> {
    const existingUser = await this.usersService.findByEmail(email, {
      password: true,
    });
    if (existingUser) {
      const isValid = await this.validatePassword(
        existingUser.password,
        body.oldPassword,
      );
      if (isValid) {
        await this.usersService.updateUserPassword(email, body.newPassword);
        return { success: true, message: "Password updated" };
      } else {
        return { success: false, message: "Invalid credentials" };
      }
    }
  }

  async validatePassword(hashed: string, plain: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }

  createToken(claim: {
    email: string;
    role: string;
    permissions: string[];
  }): string {
    const token = this.jwtService.sign(claim, this.jwtConfig);

    return token;
  }

  validateToken(token: string): boolean {
    try {
      this.jwtService.verify(token, this.jwtConfig);
      return true;
    } catch (error) {
      return false;
    }
  }

  decodeToken(
    token: string,
  ): { email: string; role: string; permissions: string[] } | null {
    try {
      return this.jwtService.decode(token, this.jwtConfig);
    } catch (error) {
      this.logger.error(`Error decoding token: ${error}`);
      return null;
    }
  }
}
