import { Module } from "@nestjs/common";
import { PaymentCategoryService } from "./payment-category.service";
import { PaymentCategoryController } from "./payment-category.controller";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [PaymentCategoryController],
  providers: [PaymentCategoryService],
  exports: [PaymentCategoryService],
})
export class PaymentCategoryModule {}
