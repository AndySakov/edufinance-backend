import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { UserRoles } from "src/shared/constants";
import { AuthUser, Roles } from "src/shared/decorators";
import {
  AuthenticatedUser,
  ResponseWithNoData,
  ResponseWithOptionalData,
  User,
} from "src/shared/interfaces";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { RBACGuard } from "./rbac.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(
    @Body() body: LoginDto,
  ): Promise<ResponseWithOptionalData<User & { token: string }>> {
    return this.authService.login(body);
  }

  @Post("update-password")
  @UseGuards(RBACGuard)
  @Roles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.STUDENT)
  async updatePassword(
    @AuthUser() user: AuthenticatedUser,
    @Body() body: UpdatePasswordDto,
  ): Promise<ResponseWithNoData> {
    return this.authService.updatePassword(user.email, body);
  }
}
