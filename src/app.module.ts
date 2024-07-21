import { DrizzleMySqlModule } from "@knaadh/nestjs-drizzle-mysql2";
import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { AdminsModule } from "./admins/admins.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { Database, DRIZZLE } from "./db";
import * as schema from "./db/schema";
import envSchema from "./env-schema";
import { MailModule } from "./mail/mail.module";
import { UsersModule } from "./users/users.module";
import { UsersService } from "./users/users.service";
import { StudentsModule } from "./students/students.module";
import { BillsModule } from "./bills/bills.module";
import { ProgrammesModule } from "./programmes/programmes.module";
import { SeederModule } from "./seeder/seeder.module";
import { PaymentCategoryModule } from "./payment-category/payment-category.module";
import { BillTypeModule } from "./bill-types/bill-types.module";
import { FinancialAidTypesModule } from "./financial-aid-types/financial-aid-types.module";
import { FinancialAidDiscountsModule } from "./financial-aid-discounts/financial-aid-discounts.module";
import { FinancialAidApplicationsModule } from "./financial-aid-applications/financial-aid-applications.module";
import { PaymentsModule } from "./payments/payments.module";
import { StudentModule } from "./student/student.module";
import { TransactionModule } from "./transaction/transaction.module";
import { PaymentCategoryService } from "./payment-category/payment-category.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
    DrizzleMySqlModule.registerAsync({
      tag: DRIZZLE,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          mysql: {
            connection: "client",
            config: {
              host: configService.get<string>("DB_HOST"),
              user: configService.get<string>("DB_USER"),
              password: configService.get<string>("DB_PASSWORD"),
              database: configService.get<string>("DB_NAME"),
            },
          },
          config: { schema: { ...schema }, mode: "default" },
        };
      },
    }),
    AuthModule,
    UsersModule,
    AdminsModule,
    MailModule,
    StudentsModule,
    BillsModule,
    BillTypeModule,
    ProgrammesModule,
    SeederModule,
    PaymentCategoryModule,
    FinancialAidTypesModule,
    FinancialAidDiscountsModule,
    FinancialAidApplicationsModule,
    PaymentsModule,
    StudentModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(
    @Inject(DRIZZLE) private readonly drizzle: Database,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly paymentCategoryService: PaymentCategoryService,
  ) {}

  async onModuleInit() {
    await migrate(this.drizzle, { migrationsFolder: "src/db/migrations" });
    await this.userService.createPermissions();
    await this.userService.createSuperAdmin(
      this.configService.get<string>("SUPER_ADMIN_EMAIL"),
      this.configService.get<string>("SUPER_ADMIN_PASSWORD"),
    );
    await this.paymentCategoryService.seedPaystack();
  }
}
