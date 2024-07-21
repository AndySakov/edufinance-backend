import { Module } from "@nestjs/common";
import { FinancialAidApplicationsService } from "./financial-aid-applications.service";
import { FinancialAidApplicationsController } from "./financial-aid-applications.controller";
import { FinancialAidTypesModule } from "src/financial-aid-types/financial-aid-types.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [FinancialAidTypesModule, AuthModule],
  controllers: [FinancialAidApplicationsController],
  providers: [FinancialAidApplicationsService],
})
export class FinancialAidApplicationsModule {}
