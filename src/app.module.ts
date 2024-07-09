import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DrizzleMySqlModule } from "@knaadh/nestjs-drizzle-mysql2";
import { UsersModule } from "./users/users.module";
import envSchema from "./env-schema";
import * as schema from "./db/schema";
import { MailerModule } from "nestjs-mailer";
import { Database, DRIZZLE } from "./db";
import { migrate } from "drizzle-orm/mysql2/migrator";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
    DrizzleMySqlModule.registerAsync({
      tag: DRIZZLE,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          mysql: {
            connection: "client",
            config: {
              host: configService.get<string>("DB_HOST"),
              user: configService.get<string>("DB_USER"),
              password: configService.get<string>("DB_PASSWORD"),
              database: configService.get<string>("DB_NAME"),
            },
          },
          config: { schema: { ...schema }, mode: "default" },
        };
      },
    }),
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
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(@Inject(DRIZZLE) private readonly drizzle: Database) {}

  async onModuleInit() {
    await migrate(this.drizzle, { migrationsFolder: "src/db/migrations" });
  }
}
