import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginInput } from "./login.input";
import { ResponseWithOptionalData, User } from "src/shared/interfaces";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(
    @Body() body: LoginInput,
  ): Promise<ResponseWithOptionalData<User & { token: string }>> {
    return this.authService.login(body);
  }
}
