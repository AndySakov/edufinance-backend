import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ProgrammesService } from "./programmes.service";
import { CreateProgrammeDto } from "./dto/create-programme.dto";
import { UpdateProgrammeDto } from "./dto/update-programme.dto";
import { RBACGuard } from "src/auth/rbac.guard";
import { UserRoles } from "src/shared/constants";
import { AdminPermissions } from "src/shared/constants/admin-permissions";
import { Permissions, Roles } from "src/shared/decorators";

@Controller("programmes")
@UseGuards(RBACGuard)
@Roles(UserRoles.ADMIN)
@Permissions(AdminPermissions.PROGRAMME_MANAGEMENT)
export class ProgrammesController {
  constructor(private readonly programmesService: ProgrammesService) {}

  @Post()
  create(@Body() createProgrammeDto: CreateProgrammeDto) {
    return this.programmesService.create(createProgrammeDto);
  }

  @Get()
  findAll() {
    return this.programmesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.programmesService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateProgrammeDto: UpdateProgrammeDto,
  ) {
    return this.programmesService.update(+id, updateProgrammeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.programmesService.remove(+id);
  }
}
