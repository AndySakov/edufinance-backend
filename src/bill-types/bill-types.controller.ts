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
import { BillTypeService } from "./bill-types.service";
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
export class BillTypeController {
  constructor(private readonly billTypeService: BillTypeService) {}

  @Post()
  create(@Body() createBillTypeDto: CreateBillTypeDto) {
    return this.billTypeService.create(createBillTypeDto);
  }

  @Get()
  findAll() {
    return this.billTypeService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.billTypeService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateBillTypeDto: UpdateBillTypeDto,
  ) {
    return this.billTypeService.update(+id, updateBillTypeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.billTypeService.remove(+id);
  }
}
