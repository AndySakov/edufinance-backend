import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ValidationPipe,
} from "@nestjs/common";
import { StudentsService } from "./students.service";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { RBACGuard } from "src/auth/rbac.guard";
import { Permissions, Roles } from "src/shared/decorators";
import { UserRoles } from "src/shared/constants";
import { AdminPermissions } from "src/shared/constants/admin-permissions";
import { GetStudentsDto } from "./dto/get-students.dto";

@Controller("students")
@UseGuards(RBACGuard)
@Roles(UserRoles.ADMIN)
@Permissions(AdminPermissions.STUDENT_MANAGEMENT)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    params: GetStudentsDto,
  ) {
    return this.studentsService.findAll(params);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.studentsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(+id, updateStudentDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.studentsService.remove(+id);
  }
}
