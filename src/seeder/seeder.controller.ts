import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { SeederService } from "./seeder.service";
import { RBACGuard } from "src/auth/rbac.guard";
import { UserRoles } from "src/shared/constants";
import { Roles } from "src/shared/decorators";

@Controller("seeder")
@UseGuards(RBACGuard)
@Roles(UserRoles.SUPER_ADMIN)
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Get("seed/students")
  seedStudents(@Query("count") count: number) {
    return this.seederService.seedStudents(count);
  }

  @Get("seed/admins")
  seedAdmins(@Query("count") count: number) {
    return this.seederService.seedAdmins(count);
  }

  @Get("seed/programmes")
  seedProgrammes(@Query("count") count: number) {
    return this.seederService.seedProgrammes(count);
  }
}
