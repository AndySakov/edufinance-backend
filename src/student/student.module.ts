import { Module } from "@nestjs/common";
import { StudentService } from "./student.service";
import { StudentController } from "./student.controller";
import { AuthModule } from "src/auth/auth.module";
import { StudentsModule } from "src/students/students.module";

@Module({
  imports: [AuthModule, StudentsModule],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
