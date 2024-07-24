import { Inject, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { and, asc, count, eq, like, or } from "drizzle-orm";
import { Database, DRIZZLE } from "src/db";
import { studentDetails } from "src/db/student-details";
import { users } from "src/db/users";
import { randomPassword, randomStudentId } from "src/shared/helpers/random";
import { data } from "src/shared/interfaces";
import { CustomLogger } from "src/shared/utils/custom-logger";
import { UsersService } from "src/users/users.service";
import { CreateStudentDto } from "./dto/create-student.dto";
import { GetStudentsDto } from "./dto/get-students.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { MailService } from "src/mail/mail.service";
import { studentsToProgrammes } from "src/db/students-to-programmes";
import { programmes } from "src/db/programmes";
import { ProgrammesService } from "src/programmes/programmes.service";
import { generateNewUserEmail } from "src/shared/helpers/email-generators";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class StudentsService {
  private readonly logger = new CustomLogger(StudentsService.name);
  constructor(
    @Inject(DRIZZLE)
    private readonly drizzle: Database,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly programmesService: ProgrammesService,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    try {
      const existingStudent = await this.usersService.findByEmail(
        createStudentDto.email,
        {
          permissions: false,
          details: true,
          password: false,
          role: "student",
        },
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
        dateOfBirth: new Date(createStudentDto.dateOfBirth),
        gender: createStudentDto.gender,
        nationality: createStudentDto.nationality,
        phoneNumber: createStudentDto.phoneNumber,
        studentId: createStudentDto.studentId ?? randomStudentId(),
      });
      const studentDetailsId = await this.drizzle.query.users.findFirst({
        where: eq(users.email, createStudentDto.email),
        columns: {},
        with: {
          studentDetails: {
            columns: {
              id: true,
            },
          },
        },
      });
      await this.programmesService.addStudentToProgramme(
        +createStudentDto.programmeId,
        studentDetailsId.studentDetails.id,
      );
      const loginUrl = `${this.configService.get<string>("FE_DOMAIN")}/login`;
      await this.mailService.sendMail({
        to: createStudentDto.email,
        subject: "New student account created",
        html: generateNewUserEmail(
          createStudentDto.firstName,
          createStudentDto.lastName,
          createStudentDto.email,
          loginUrl,
          defaultPassword,
        ),
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

  async findAll(params: GetStudentsDto) {
    try {
      const filter = params.query
        ? or(
            like(studentDetails.firstName, `%${params.query}%`),
            like(studentDetails.lastName, `%${params.query}%`),
            like(studentDetails.middleName, `%${params.query}%`),
            like(studentDetails.studentId, `%${params.query}%`),
            like(studentDetails.phoneNumber, `%${params.query}%`),
          )
        : null;

      const students = await this.drizzle
        .select()
        .from(studentDetails)
        .where(filter)
        .orderBy(asc(users.id))
        .limit(params.limit ?? 10)
        .offset(((params.page ?? 1) - 1) * params.limit ?? 10)
        .innerJoin(users, eq(studentDetails.userId, users.id))
        .rightJoin(
          studentsToProgrammes,
          eq(studentDetails.id, studentsToProgrammes.studentId),
        )
        .innerJoin(
          programmes,
          eq(studentsToProgrammes.programmeId, programmes.id),
        );

      const total = await this.drizzle
        .select({ count: count() })
        .from(studentDetails)
        .rightJoin(
          studentsToProgrammes,
          eq(studentDetails.id, studentsToProgrammes.studentId),
        )
        .innerJoin(
          programmes,
          eq(studentsToProgrammes.programmeId, programmes.id),
        )
        .where(filter);

      return {
        page: params.page ?? 1,
        count: students.length,
        total: total[0].count,
        data: students.map(s => ({
          id: s.users.id,
          email: s.users.email,
          role: s.users.role,
          details: {
            ...s.student_details,
            id: undefined,
            userId: undefined,
            programme: s.programmes.name,
          },
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
            with: {
              studentsToProgrammes: {
                columns: {
                  studentId: false,
                  programmeId: false,
                },
                with: {
                  programme: {
                    columns: {
                      id: false,
                      programmeId: false,
                      name: true,
                    },
                  },
                },
              },
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
            details: {
              ...student.studentDetails,
              studentsToProgrammes: undefined,
              programme:
                student.studentDetails.studentsToProgrammes[0].programme.name,
            },
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
        const studentDetails = (
          await this.drizzle.query.users.findFirst({
            where: eq(users.id, existingStudent.id),
            columns: {},
            with: {
              studentDetails: {
                columns: {
                  id: true,
                },
                with: {
                  studentsToProgrammes: {
                    columns: {},
                    with: {
                      programme: {
                        columns: {
                          id: true,
                          programmeId: false,
                          name: false,
                        },
                      },
                    },
                  },
                },
              },
            },
          })
        ).studentDetails;
        if (studentDetails) {
          this.programmesService.removeStudentFromProgramme(
            studentDetails.studentsToProgrammes[0].programme.id,
            studentDetails.id,
          );
        }
        await this.programmesService.addStudentToProgramme(
          +updateStudentDto.programmeId,
          studentDetails.id,
        );
        await this.usersService.updateStudentDetails(existingStudent.email, {
          ...updateStudentDto,
          dateOfBirth: new Date(updateStudentDto.dateOfBirth),
        });
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
