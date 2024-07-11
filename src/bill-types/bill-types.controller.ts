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
import { BillTypesService } from "./bill-types.service";
import { CreateBillTypeDto } from "./dto/create-bill-type.dto";
import { UpdateBillTypeDto } from "./dto/update-bill-type.dto";
import { RBACGuard } from "src/auth/rbac.guard";
import { UserRoles } from "src/shared/constants";
import { AdminPermissions } from "src/shared/constants/admin-permissions";
import { Permissions, Roles } from "src/shared/decorators";

@Controller("bill-types")
@UseGuards(RBACGuard)
@Roles(UserRoles.ADMIN)
@Permissions(AdminPermissions.FEE_AND_DUES_MANAGEMENT)
export class BillTypesController {
  constructor(private readonly billTypesService: BillTypesService) {}

  @Post()
  create(@Body() createBillTypeDto: CreateBillTypeDto) {
    return this.billTypesService.create(createBillTypeDto);
  }

  @Get()
  findAll() {
    return this.billTypesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.billTypesService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateBillTypeDto: UpdateBillTypeDto,
  ) {
    return this.billTypesService.update(+id, updateBillTypeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.billTypesService.remove(+id);
  }
}
