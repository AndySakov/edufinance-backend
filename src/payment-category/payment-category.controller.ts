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
import { PaymentCategoryService } from "./payment-category.service";
import { CreatePaymentCategoryDto } from "./dto/create-payment-category.dto";
import { UpdatePaymentCategoryDto } from "./dto/update-payment-category.dto";
import { RBACGuard } from "src/auth/rbac.guard";
import { UserRoles } from "src/shared/constants";
import { AdminPermissions } from "src/shared/constants/admin-permissions";
import { Permissions, Roles } from "src/shared/decorators";

@Controller("payment-category")
@UseGuards(RBACGuard)
@Roles(UserRoles.ADMIN)
@Permissions(AdminPermissions.PAYMENT_MANAGEMENT)
export class PaymentCategoryController {
  constructor(
    private readonly paymentCategoryService: PaymentCategoryService,
  ) {}

  @Post()
  create(@Body() createPaymentCategoryDto: CreatePaymentCategoryDto) {
    return this.paymentCategoryService.create(createPaymentCategoryDto);
  }

  @Get()
  findAll() {
    return this.paymentCategoryService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.paymentCategoryService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updatePaymentCategoryDto: UpdatePaymentCategoryDto,
  ) {
    return this.paymentCategoryService.update(+id, updatePaymentCategoryDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.paymentCategoryService.remove(+id);
  }
}
