import { Module } from "@nestjs/common";
import { FinancialAidTypesService } from "./financial-aid-types.service";
import { FinancialAidTypesController } from "./financial-aid-types.controller";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [FinancialAidTypesController],
  providers: [FinancialAidTypesService],
  exports: [FinancialAidTypesService],
})
export class FinancialAidTypesModule {}
