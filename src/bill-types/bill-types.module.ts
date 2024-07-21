import { Module } from "@nestjs/common";
import { BillTypeService } from "./bill-types.service";
import { BillTypeController } from "./bill-types.controller";

@Module({
  controllers: [BillTypeController],
  providers: [BillTypeService],
})
export class BillTypeModule {}
