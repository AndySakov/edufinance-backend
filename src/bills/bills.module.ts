import { Module } from "@nestjs/common";
import { BillsService } from "./bills.service";
import { BillsController } from "./bills.controller";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [BillsController],
  providers: [BillsService],
  exports: [BillsService],
})
export class BillsModule {}
