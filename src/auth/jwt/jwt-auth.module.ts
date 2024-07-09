import { forwardRef, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtAuthStrategy } from "./jwt-auth.strategy";
import { AuthModule } from "../auth.module";
import { UsersService } from "src/users/users.service";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRES_IN"),
        },
      }),
    }),
    ConfigModule,
  ],
  providers: [JwtAuthStrategy, UsersService],
  exports: [JwtAuthStrategy],
})
export class JwtAuthModule {}
