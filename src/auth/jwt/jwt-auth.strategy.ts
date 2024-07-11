import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { CustomLogger } from "src/shared/utils/custom-logger";
import { AuthService } from "../auth.service";
import { UsersService } from "src/users/users.service";
import { AuthenticatedUser } from "src/shared/interfaces";

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new CustomLogger(JwtAuthStrategy.name);
  constructor(
    readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userServie: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
      ignoreExpiration:
        configService.get<string>("JWT_IGNORE_EXPIRATION") == "true",
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }

  async validate(payload: string): Promise<AuthenticatedUser | null> {
    const user = this.authService.decodeToken(payload);
    return this.userServie.findByEmail(user.email);
  }
}
