import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { RBACGuard } from "src/auth/rbac.guard";
import { UserRoles } from "src/shared/constants";
import { AdminPermissions } from "src/shared/constants/admin-permissions";
import { Permissions, Roles } from "src/shared/decorators";
import { AdminsService } from "./admins.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { UpdatePermissionsDto } from "./dto/update-permissions.dto";

@Controller("admins")
@UseGuards(RBACGuard)
@Roles(UserRoles.ADMIN)
@Permissions(
  AdminPermissions.USER_MANAGEMENT,
  AdminPermissions.SECURITY_AND_ACCESS_CONTROL,
)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @Get()
  findAll() {
    return this.adminsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.adminsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(+id, updateAdminDto);
  }

  @Patch(":id/permissions")
  updatePermissions(
    @Param("id") id: string,
    @Body() updatePermissionsDto: UpdatePermissionsDto,
  ) {
    return this.adminsService.updatePermissions(+id, updatePermissionsDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.adminsService.remove(+id);
  }
}
