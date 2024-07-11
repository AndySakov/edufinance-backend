import { Module } from "@nestjs/common";
import { StudentsService } from "./students.service";
import { StudentsController } from "./students.controller";
import { UsersModule } from "src/users/users.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
