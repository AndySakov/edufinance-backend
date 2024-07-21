import { Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BillsModule } from "src/bills/bills.module";
import { StudentModule } from "src/student/student.module";
import { PaymentCategoryModule } from "src/payment-category/payment-category.module";
import { PaymentsModule } from "src/payments/payments.module";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        headers: {
          Authorization: `Bearer ${configService.get<string>(
            "PAYSTACK_SECRET_KEY",
          )}`,
        },
        baseURL: configService.get<string>("PAYSTACK_DOMAIN"),
      }),
    }),
    BillsModule,
    StudentModule,
    PaymentsModule,
    PaymentCategoryModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
