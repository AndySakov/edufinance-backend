import { Module } from "@nestjs/common";
import { FinancialAidDiscountsService } from "./financial-aid-discounts.service";
import { FinancialAidDiscountsController } from "./financial-aid-discounts.controller";
import { FinancialAidTypesModule } from "src/financial-aid-types/financial-aid-types.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [FinancialAidTypesModule, AuthModule],
  controllers: [FinancialAidDiscountsController],
  providers: [FinancialAidDiscountsService],
  exports: [FinancialAidDiscountsService],
})
export class FinancialAidDiscountsModule {}
