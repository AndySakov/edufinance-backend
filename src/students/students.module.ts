import { Module } from "@nestjs/common";
import { StudentsService } from "./students.service";
import { StudentsController } from "./students.controller";
import { UsersModule } from "src/users/users.module";
import { AuthModule } from "src/auth/auth.module";
import { MailModule } from "src/mail/mail.module";
import { ProgrammesModule } from "src/programmes/programmes.module";

@Module({
  imports: [UsersModule, AuthModule, MailModule, ProgrammesModule],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
