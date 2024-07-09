import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { Database, DRIZZLE } from "src/db";
import { User, users } from "src/db/users";
import { ResponseWithOptionalData } from "src/shared/interfaces";
import { LoginInput } from "./login.input";
import { CustomLogger } from "src/shared/utils/custom-logger";

@Injectable()
export class AuthService {
  private readonly jwtConfig: object;
  private readonly logger = new CustomLogger(AuthService.name);
  constructor(
    @Inject(DRIZZLE)
    private readonly drizzle: Database,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtConfig = {
      secret: this.configService.get<string>("JWT_SECRET"),
      mutatePayload: false,
    };
  }

  async login(body: LoginInput): Promise<
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
        id: true,
        email: true,
        password: true,
        role: true,
      },
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
      },
    });
    if (user.email) {
      const isValid = await this.validatePassword(body.password, user.password);
      if (isValid) {
        const permissions = user.usersToPermissions.map(p => p.permission.name);
        return {
          success: true,
          message: "Login successful",
          data: {
            id: user.id,
            email: user.email,
            role: user.role,
            permissions,
            token: this.createToken({
              email: user.email,
              role: user.role,
              permissions,
            }),
          },
        };
      } else {
        return { success: false, message: "Invalid password" };
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
