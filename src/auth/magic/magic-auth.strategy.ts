import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import Strategy from "passport-magic-login";
import { CustomLogger } from "src/shared/utils/custom-logger";
import { UsersService } from "src/users/users.service";
import { MailService } from "src/mail/mail.service";
import { User } from "src/db/users";
import { generateResetPasswordEmail } from "src/shared/helpers/email-generators";

@Injectable()
export class MagicAuthStrategy extends PassportStrategy(Strategy, "magic") {
  private readonly logger = new CustomLogger(MagicAuthStrategy.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly mailService: MailService,
  ) {
    super({
      secret: configService.get<string>("MAGIC_LINK_SECRET"),
      jwtOptions: {
        expiresIn: configService.get<string>("MAGIC_LINK_EXPIRES_IN"),
      },
      callbackUrl: "/password/reset",
      sendMagicLink: async (destination: string, href: string) =>
        this.sendToken(destination, href),
      // eslint-disable-next-line @typescript-eslint/ban-types
      verify: async (payload: { destination: string }, callback: Function) => {
        const user = await this.verifyUser(payload.destination);
        if (user === null) {
          callback({ success: false, message: "Password reset failed" });
        } else {
          callback(null, user);
        }
      },
    });
  }

  async sendToken(destination: string, href: string): Promise<void> {
    this.logger.log(`Sending magic link to ${destination}`);
    const user = await this.verifyUser(destination);
    if (user === null) {
      throw new Error("Password reset failed");
    }
    const details = await this.userService.findByEmail(destination, {
      details: true,
      role: user.role,
    });
    const link = `${this.configService.get<string>("FE_DOMAIN")}${href}`;
    const msg = {
      to: destination,
      subject: "Reset your password for EduFinance",
      html: generateResetPasswordEmail(details.details.firstName, link),
    };
    return this.mailService.sendMail(msg);
  }

  async verifyUser(payload: string): Promise<User | null> {
    return this.userService
      .findByEmail(payload, { details: false })
      .then(user => {
        if (user !== undefined) {
          return user;
        } else {
          return null;
        }
      })
      .catch(err => {
        this.logger.error(`MagicAuthStrategy::verifyUser ${err.message}`);
        return null;
      });
  }
}
