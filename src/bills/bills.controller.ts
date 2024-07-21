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
import { BillsService } from "./bills.service";
import { CreateBillDto } from "./dto/create-bill.dto";
import { UpdateBillDto } from "./dto/update-bill.dto";
import { RBACGuard } from "src/auth/rbac.guard";
import { UserRoles } from "src/shared/constants";
import { AdminPermissions } from "src/shared/constants/admin-permissions";
import { Permissions, Roles } from "src/shared/decorators";

@Controller("bills")
@UseGuards(RBACGuard)
@Roles(UserRoles.ADMIN)
@Permissions(AdminPermissions.FEE_AND_DUES_MANAGEMENT)
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Post()
  create(@Body() createBillDto: CreateBillDto) {
    return this.billsService.create(createBillDto);
  }

  @Get()
  findAll() {
    return this.billsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.billsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateBillDto: UpdateBillDto) {
    return this.billsService.update(+id, updateBillDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.billsService.remove(+id);
  }
}
