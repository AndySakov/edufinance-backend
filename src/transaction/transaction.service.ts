import { Injectable } from "@nestjs/common";
import { catchError, firstValueFrom, map, of } from "rxjs";
import { BillsService } from "src/bills/bills.service";
import { PaymentCategoryService } from "src/payment-category/payment-category.service";
import { PaymentsService } from "src/payments/payments.service";
import {
  data,
  PaystackResponse,
  PaystackWebhookPayload,
  ResponseWithOptionalData,
  VerifyTransactionResponse,
} from "src/shared/interfaces";
import { StudentService } from "src/student/student.service";
import { InitiateTransactionDto } from "./dto/initiate-transaction.dto";
import { randomTransactionReference } from "src/shared/helpers/random";
import { CustomLogger } from "src/shared/utils/custom-logger";
import { HttpService } from "@nestjs/axios";
import { AxiosError } from "axios";
import { ref } from "joi";

@Injectable()
export class TransactionService {
  private readonly logger = new CustomLogger(TransactionService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly billsService: BillsService,
    private readonly paymentsService: PaymentsService,
    private readonly studentService: StudentService,
    private readonly paymentCategoryService: PaymentCategoryService,
  ) {}

  async initiatePayment(payload: InitiateTransactionDto): Promise<
    ResponseWithOptionalData<{
      authorization_url: string;
      access_code: string;
      reference: string;
    }>
  > {
    try {
      const bill = await this.billsService.findOne(payload.billId);
      if (!bill || bill.success === false) {
        return {
          success: false,
          message: "Bill not found",
        };
      } else {
        const payerId = await this.studentService.getStudentId(payload.email);
        const paymentTypeId = data(
          await this.paymentCategoryService.findByName("Paystack"),
        ).id;
        const res = (await firstValueFrom(
          this.httpService
            .post<
              PaystackResponse<{
                authorization_url: string;
                access_code: string;
                reference: string;
              }>
            >(`/transaction/initialize`, {
              amount: `${Number(payload.amount) * 100}`,
              email: payload.email,
              reference: randomTransactionReference(),
              currency: "NGN",
            })
            .pipe(
              map(res => res.data),
              catchError((err: AxiosError) => {
                this.logger.error(`Error initiating payment: ${err.message}`);
                return of(err);
              }),
            ),
        )) as PaystackResponse<{
          authorization_url: string;
          access_code: string;
          reference: string;
        }>;
        if (res.status === true) {
          await this.paymentsService.create({
            billId: payload.billId,
            payerId,
            paymentTypeId,
            paymentReference: res.data.reference,
            status: "pending",
            paymentNote: "Paid with Paystack",
            amount: +payload.amount,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          return {
            success: true,
            message: "Payment initiated",
            data: res.data,
          };
        } else {
          return {
            success: false,
            message: res.message,
          };
        }
      }
    } catch (error) {
      this.logger.error(`Error initiating payment: ${error}`);
      return {
        success: false,
        message: "Error initiating payment",
      };
    }
  }

  async verifyPayment(
    payload: PaystackWebhookPayload,
  ): Promise<ResponseWithOptionalData<boolean>> {
    const res = (await firstValueFrom(
      this.httpService
        .get<
          PaystackResponse<VerifyTransactionResponse>
        >(`/transaction/verify/${payload.data.reference}`)
        .pipe(
          map(res => res.data),
          catchError((err: AxiosError) => {
            this.logger.error(`Error verifying payment: ${err.message}`);
            return of(err);
          }),
        ),
    )) as PaystackResponse<VerifyTransactionResponse>;
    console.log(res);

    if (res.status === true) {
      this.logger.log(`Payment verified: ${res.data.reference}`);
      const payment = data(
        await this.paymentsService.findByReference(res.data.reference),
      );
      // const amount = res.data.amount / 100;
      if (
        payment &&
        // payment.amount === amount &&
        res.data.status === "success"
      ) {
        this.logger.log(
          `Payment marked as paid (${res.data.status}): ${res.data.reference}`,
        );
        await this.paymentsService.updateStatus(payment.id, "paid");
      } else {
        if (res.data.status === "failed") {
          this.logger.log(
            `Payment marked as failed (${res.data.status}): ${res.data.reference}`,
          );
          await this.paymentsService.updateStatus(payment.id, "failed");
        } else if (res.data.status === "abandoned") {
          this.logger.log(
            `Payment marked as abandoned (${res.data.status}): ${res.data.reference}`,
          );
          await this.paymentsService.updateStatus(
            payment.id,
            "failed",
            "Payment was abandoned",
          );
        } else if (["processing", "ongoing"].includes(res.data.status)) {
          this.logger.log(
            `Payment marked as pending (${res.data.status}): ${res.data.reference}`,
          );
          await this.paymentsService.updateStatus(
            payment.id,
            "pending",
            "Payment is still processing",
          );
        } else {
          this.logger.log(
            `Payment marked as failed (${res.data.status}): ${res.data.reference}`,
          );
          await this.paymentsService.updateStatus(
            payment.id,
            "failed",
            "Payment failed due to unknown reason",
          );
        }
      }
    } else {
      return {
        success: false,
        message: "Payment not verified",
      };
    }
  }
}
