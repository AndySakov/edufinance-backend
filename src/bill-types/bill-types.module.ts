import { Module } from "@nestjs/common";
import { BillTypeService } from "./bill-types.service";
import { BillTypeController } from "./bill-types.controller";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [BillTypeController],
  providers: [BillTypeService],
})
export class BillTypeModule {}
