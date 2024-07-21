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
import { FinancialAidTypesService } from "./financial-aid-types.service";
import { CreateFinancialAidTypeDto } from "./dto/create-financial-aid-type.dto";
import { UpdateFinancialAidTypeDto } from "./dto/update-financial-aid-type.dto";
import { RBACGuard } from "src/auth/rbac.guard";
import { UserRoles } from "src/shared/constants";
import { AdminPermissions } from "src/shared/constants/admin-permissions";
import { Permissions, Roles } from "src/shared/decorators";

@Controller("financial-aid-types")
@UseGuards(RBACGuard)
@Roles(UserRoles.ADMIN)
@Permissions(AdminPermissions.FINANCIAL_AID_GRADES_MANAGEMENT)
export class FinancialAidTypesController {
  constructor(
    private readonly financialAidTypesService: FinancialAidTypesService,
  ) {}

  @Post()
  create(@Body() createFinancialAidTypeDto: CreateFinancialAidTypeDto) {
    return this.financialAidTypesService.create(createFinancialAidTypeDto);
  }

  @Get()
  findAll() {
    return this.financialAidTypesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.financialAidTypesService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateFinancialAidTypeDto: UpdateFinancialAidTypeDto,
  ) {
    return this.financialAidTypesService.update(+id, updateFinancialAidTypeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.financialAidTypesService.remove(+id);
  }
}
