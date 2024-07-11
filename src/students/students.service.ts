import { Inject, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { and, eq } from "drizzle-orm";
import { Database, DRIZZLE } from "src/db";
import { users } from "src/db/users";
import { randomPassword, randomStudentId } from "src/shared/helpers";
import { UsersService } from "src/users/users.service";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { CustomLogger } from "src/shared/utils/custom-logger";
import { data } from "src/shared/interfaces";

@Injectable()
export class StudentsService {
  private readonly logger = new CustomLogger(StudentsService.name);
  constructor(
    @Inject(DRIZZLE)
    private readonly drizzle: Database,
    private readonly usersService: UsersService,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    try {
      const existingStudent = this.usersService.findByEmail(
        createStudentDto.email,
      );
      if (existingStudent) {
        throw new Error("Student already exists");
      }
      const defaultPassword = randomPassword();
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      await this.drizzle.insert(users).values({
        email: createStudentDto.email,
        password: hashedPassword,
        role: "student",
      });
      await this.usersService.createStudentDetails(createStudentDto.email, {
        firstName: createStudentDto.firstName,
        lastName: createStudentDto.lastName,
        middleName: createStudentDto.middleName,
        address: createStudentDto.address,
        city: createStudentDto.city,
        state: createStudentDto.state,
        zipCode: createStudentDto.zipCode,
        country: createStudentDto.country,
        dateOfBirth: createStudentDto.dateOfBirth,
        gender: createStudentDto.gender,
        nationality: createStudentDto.nationality,
        phoneNumber: createStudentDto.phoneNumber,
        studentId: randomStudentId(),
      });
      return {
        success: true,
        message: "Student created",
        data: await this.usersService.findByEmail(createStudentDto.email, {
          permissions: false,
          details: true,
          password: false,
          role: "student",
        }),
      };
    } catch (error) {
      this.logger.error(`Error creating student: ${error}`);
      return {
        success: false,
        message: "Error creating student",
      };
    }
  }

  async findAll() {
    try {
      const students = await this.drizzle.query.users.findMany({
        where: eq(users.role, "student"),
        with: {
          studentDetails: {
            columns: {
              id: false,
              userId: false,
            },
          },
        },
      });
      return {
        success: true,
        message: "Students found",
        data: students.map(s => ({
          id: s.id,
          email: s.email,
          role: s.role,
          details: s.studentDetails,
        })),
      };
    } catch (error) {
      this.logger.error(`Error finding students: ${error}`);
      return {
        success: false,
        message: "Error finding students",
      };
    }
  }

  async findOne(id: number) {
    try {
      const student = await this.drizzle.query.users.findFirst({
        where: and(eq(users.id, id), eq(users.role, "student")),
        with: {
          studentDetails: {
            columns: {
              id: false,
              userId: false,
            },
          },
        },
      });
      if (student) {
        return {
          success: true,
          message: "Student found",
          data: {
            id: student.id,
            email: student.email,
            role: student.role,
            details: student.studentDetails,
          },
        };
      } else {
        return {
          success: false,
          message: "Student not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error finding student: ${error}`);
      return {
        success: false,
        message: "Error finding student",
      };
    }
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    try {
      const existingStudent = data(await this.findOne(id));
      if (existingStudent) {
        await this.usersService.updateStudentDetails(
          existingStudent.email,
          updateStudentDto,
        );
        return {
          success: true,
          message: "Student updated",
          data: await this.findOne(id),
        };
      } else {
        return {
          success: false,
          message: "Student not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error updating student: ${error}`);
      return {
        success: false,
        message: "Error updating student",
      };
    }
  }

  async remove(id: number) {
    const existingStudent = data(await this.findOne(id));
    if (existingStudent) {
      await this.drizzle.delete(users).where(eq(users.id, id));
      return {
        success: true,
        message: "Student removed",
      };
    } else {
      return {
        success: false,
        message: "Student not found",
      };
    }
  }
}
