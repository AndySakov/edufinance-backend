import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from "nestjs-mailer";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          transport: {
            host: configService.get<string>("MAILTRAP_HOST"),
            port: configService.get<number>("MAILTRAP_PORT"),
            secure: configService.get<boolean>("MAILTRAP_SECURE"),
            auth: {
              user: configService.get<string>("MAILTRAP_USER"),
              pass: configService.get<string>("MAILTRAP_PASS"),
            },
          },
          defaults: {
            from: configService.get<string>("MAILTRAP_FROM"),
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
