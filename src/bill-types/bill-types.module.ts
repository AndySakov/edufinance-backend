import { Module } from "@nestjs/common";
import { BillTypesService } from "./bill-types.service";
import { BillTypesController } from "./bill-types.controller";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [BillTypesController],
  providers: [BillTypesService],
})
export class BillTypesModule {}
