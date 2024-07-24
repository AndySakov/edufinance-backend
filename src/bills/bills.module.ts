import { Module } from "@nestjs/common";
import { BillsService } from "./bills.service";
import { BillsController } from "./bills.controller";
import { AuthModule } from "src/auth/auth.module";
import { MailModule } from "src/mail/mail.module";

@Module({
  imports: [AuthModule, MailModule],
  controllers: [BillsController],
  providers: [BillsService],
  exports: [BillsService],
})
export class BillsModule {}
