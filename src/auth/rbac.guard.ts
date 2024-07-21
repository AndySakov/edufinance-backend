import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { UserRoles } from "src/shared/constants";
import { AuthService } from "./auth.service";
import { AuthenticatedUser } from "src/shared/interfaces";
import { Request } from "express";

@Injectable()
export class RBACGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  private async getSession(req: Request): Promise<AuthenticatedUser | null> {
    const token = req.headers["authorization"].split(" ")[1];
    if (token) {
      const decoded = this.authService.decodeToken(token);
      if (decoded) {
        return decoded;
      } else {
        throw new ForbiddenException({
          success: false,
          message: "Forbidden resource: Invalid token",
        });
      }
    } else {
      throw new ForbiddenException({
        success: false,
        message: "Forbidden resource: No token provided",
      });
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request & { user: AuthenticatedUser }>();
    const session = await this.getSession(req);

    req.user = session;

    if (session?.role === UserRoles.SUPER_ADMIN) {
      return true;
    }

    const permittedRoles =
      this.reflector.get<string[]>("roles", context.getHandler()) || [];
    const requiredPermissions =
      this.reflector.get<string[]>("permissions", context.getHandler()) || [];

    if (this.configService.get<string>("NODE_ENV") === "development") {
      return true;
    } else {
      if (!permittedRoles.length && !requiredPermissions.length) {
        return true;
      }
    }

    if (
      session?.role === UserRoles.STUDENT &&
      permittedRoles.includes(UserRoles.STUDENT)
    ) {
      return true;
    }

    const meetsRoleRequirement = permittedRoles.includes(
      session?.role as string,
    );

    const meetsPermissionRequirement = requiredPermissions.every(p =>
      (session?.permissions ?? []).includes(p),
    );

    if (meetsRoleRequirement || permittedRoles.length === 0) {
      return meetsPermissionRequirement || requiredPermissions.length === 0;
    }

    throw new ForbiddenException({
      success: false,
      message: "Forbidden resource: Insufficient permissions",
    });
  }
}
