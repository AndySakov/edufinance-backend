import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
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
import { MagicAuthStrategy } from "./magic/magic-auth.strategy";
import { ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { Request, Response } from "express";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private magicStrategy: MagicAuthStrategy,
  ) {}

  @Post("login")
  async login(
    @Body() body: LoginDto,
  ): Promise<ResponseWithOptionalData<User & { token: string }>> {
    return this.authService.login(body);
  }

  @Post("password/reset")
  @UseGuards(AuthGuard("magic"))
  async updatePassword(
    @AuthUser() user: AuthenticatedUser,
    @Body() body: UpdatePasswordDto,
  ): Promise<ResponseWithNoData> {
    return this.authService.updatePassword(user.email, body);
  }

  @Post("password/reset/request")
  @UseGuards(RBACGuard)
  @Roles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.STUDENT)
  @ApiOkResponse({
    description: "Generates and sends password reset email",
    schema: { $ref: getSchemaPath(ResponseWithNoData) },
  })
  async sendDevMagicLink(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    this.magicStrategy.send(req, res);
  }

  @Get("password/reset/request/callback")
  @UseGuards(AuthGuard("magic"))
  @ApiOkResponse({
    description: "Callback for password reset email",
    schema: { $ref: getSchemaPath(ResponseWithNoData) },
  })
  async verifyDevMagicLink(
    @AuthUser() user: User,
  ): Promise<ResponseWithNoData> {
    if (user) {
      return {
        success: true,
        message: "Password reset email verified",
      };
    } else {
      return {
        success: false,
        message: "Password reset email not verified",
      };
    }
  }
}
