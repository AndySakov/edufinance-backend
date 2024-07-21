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
import { FinancialAidDiscountsService } from "./financial-aid-discounts.service";
import { CreateFinancialAidDiscountDto } from "./dto/create-financial-aid-discount.dto";
import { UpdateFinancialAidDiscountDto } from "./dto/update-financial-aid-discount.dto";
import { RBACGuard } from "src/auth/rbac.guard";
import { UserRoles } from "src/shared/constants";
import { AdminPermissions } from "src/shared/constants/admin-permissions";
import { Permissions, Roles } from "src/shared/decorators";

@Controller("financial-aid-discounts")
@UseGuards(RBACGuard)
@Roles(UserRoles.ADMIN)
@Permissions(AdminPermissions.FINANCIAL_AID_GRADES_MANAGEMENT)
export class FinancialAidDiscountsController {
  constructor(
    private readonly financialAidDiscountsService: FinancialAidDiscountsService,
  ) {}

  @Post()
  create(@Body() createFinancialAidDiscountDto: CreateFinancialAidDiscountDto) {
    return this.financialAidDiscountsService.create(
      createFinancialAidDiscountDto,
    );
  }

  @Get()
  findAll() {
    return this.financialAidDiscountsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.financialAidDiscountsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateFinancialAidDiscountDto: UpdateFinancialAidDiscountDto,
  ) {
    return this.financialAidDiscountsService.update(
      +id,
      updateFinancialAidDiscountDto,
    );
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.financialAidDiscountsService.remove(+id);
  }
}
