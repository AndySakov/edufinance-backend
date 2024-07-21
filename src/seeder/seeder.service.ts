import { Injectable } from "@nestjs/common";
import { StudentsService } from "src/students/students.service";
import { faker } from "@faker-js/faker";
import { CustomLogger } from "src/shared/utils/custom-logger";
import { AdminsService } from "src/admins/admins.service";
import { AdminPermissions } from "src/shared/constants/admin-permissions";
import { randomPhoneNumber, randomState } from "src/shared/helpers/random";
import { ProgrammesService } from "src/programmes/programmes.service";
import { data } from "src/shared/interfaces";

@Injectable()
export class SeederService {
  private readonly logger = new CustomLogger(SeederService.name);
  constructor(
    private readonly studentsService: StudentsService,
    private readonly adminsService: AdminsService,
    private readonly programmesService: ProgrammesService,
  ) {}

  async seedStudents(count: number = 10) {
    this.logger.log(`Seeding ${count} students...`);
    let programmes = data(await this.programmesService.findAll());
    if (programmes.length === 0) {
      await this.seedProgrammes(1);
      programmes = data(await this.programmesService.findAll());
    }
    for (let i = 0; i < count; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const middleName = faker.person.middleName();
      const address = faker.location.streetAddress();
      const city = faker.location.city();
      const state = randomState();
      const zipCode = faker.location.zipCode();
      const dateOfBirth = faker.date.birthdate();
      const gender = faker.datatype.boolean() ? "male" : "female";
      const phoneNumber = randomPhoneNumber();

      await this.studentsService.create({
        email: faker.internet.email({
          firstName,
          lastName,
        }),
        firstName,
        lastName,
        middleName,
        address,
        city,
        state,
        zipCode,
        country: "Nigeria",
        dateOfBirth: dateOfBirth.toISOString(),
        gender,
        nationality: "Nigerian",
        phoneNumber,
        programmeId: programmes[0].id.toString(),
      });
    }
  }

  async seedProgrammes(count: number = 10) {
    this.logger.log(`Seeding ${count} programmes...`);
    for (let i = 0; i < count; i++) {
      const name = faker.commerce.productName();
      await this.programmesService.create({
        name,
      });
    }
  }

  async seedAdmins(count: number = 10) {
    this.logger.log(`Seeding ${count} admins...`);
    await this.adminsService.create({
      email: "andysakov1958@gmail.com",
      firstName: "Andrei",
      lastName: "Petcu",
      permissions: [AdminPermissions.DASHBOARD_ACCESS],
    });
    for (let i = 0; i < count - 1; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      await this.adminsService.create({
        email: faker.internet.email({
          firstName,
          lastName,
        }),
        firstName,
        lastName,
        permissions: [AdminPermissions.DASHBOARD_ACCESS],
      });
    }
  }
}
