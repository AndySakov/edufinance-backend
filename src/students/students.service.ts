import { Inject, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { and, eq } from "drizzle-orm";
import { Database, DRIZZLE } from "src/db";
import { users } from "src/db/users";
import { randomPassword, randomStudentId } from "src/shared/helpers";
import { UsersService } from "src/users/users.service";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";

@Injectable()
export class StudentsService {
  constructor(
    @Inject(DRIZZLE)
    private readonly drizzle: Database,
    private readonly usersService: UsersService,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
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
    return this.usersService.findByEmail(createStudentDto.email, {
      permissions: false,
      details: true,
      password: false,
      role: "student",
    });
  }

  async findAll() {
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
    return students.map(s => ({
      id: s.id,
      email: s.email,
      role: s.role,
      details: s.studentDetails,
    }));
  }

  async findOne(id: number) {
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
    return {
      id: student.id,
      email: student.email,
      role: student.role,
      details: student.studentDetails,
    };
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const existingStudent = await this.findOne(id);
    if (existingStudent) {
      await this.usersService.updateStudentDetails(
        existingStudent.email,
        updateStudentDto,
      );
      return this.findOne(id);
    }
  }

  async remove(id: number) {
    const existingStudent = await this.findOne(id);
    if (existingStudent) {
      await this.drizzle.delete(users).where(eq(users.id, id));
    }
  }
}
