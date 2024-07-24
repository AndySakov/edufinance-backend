import { Module, forwardRef } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MagicAuthStrategy } from "./magic-auth.strategy";
import { MailModule } from "src/mail/mail.module";
import { AuthModule } from "../auth.module";
import { UsersModule } from "src/users/users.module";
import { UsersService } from "src/users/users.service";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    ConfigModule,
    MailModule,
  ],
  providers: [MagicAuthStrategy, UsersService],
  exports: [MagicAuthStrategy],
})
export class MagicAuthModule {}
