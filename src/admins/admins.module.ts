import { Module } from "@nestjs/common";
import { AdminsService } from "./admins.service";
import { AdminsController } from "./admins.controller";
import { UsersService } from "src/users/users.service";
import { MailService } from "src/mail/mail.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [AdminsController],
  providers: [AdminsService, UsersService, MailService],
  exports: [AdminsService],
})
export class AdminsModule {}
