import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { Roles } from "src/shared/constants";
import { AuthService } from "./auth.service";

@Injectable()
export class RBACGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  private async getSession(
    req: Request,
  ): Promise<{ email: string; role: string; permissions: string[] } | null> {
    const token = req.headers["authorization"];
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
    const req = httpContext.getRequest<Request>();
    const session = await this.getSession(req);

    const permittedRoles =
      this.reflector.get<string[]>("roles", context.getHandler()) || [];
    const requiredPermissions =
      this.reflector.get<string[]>("permissions", context.getHandler()) || [];
    if (this.configService.get<string>("NODE_ENV") === "development") {
      return true;
    } else {
      if (!permittedRoles.length || permittedRoles.includes(Roles.ANON)) {
        return true;
      }
    }

    const meetsRoleRequirement = permittedRoles.includes(
      session?.role as string,
    );
    const meetsPermissionRequirement = requiredPermissions.every(p =>
      (session?.permissions ?? []).includes(p),
    );
    if (meetsRoleRequirement && meetsPermissionRequirement) {
      return true;
    } else {
      throw new ForbiddenException({
        success: false,
        message: "Forbidden resource: Insufficient permissions",
      });
    }
  }
}
