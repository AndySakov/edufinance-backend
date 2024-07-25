import { Body, Controller, Headers, Post, Req } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { ConfigService } from "@nestjs/config";
import { PaystackWebhookPayload } from "src/shared/interfaces";
import { InitiateTransactionDto } from "./dto/initiate-transaction.dto";
import { CustomLogger } from "src/shared/utils/custom-logger";
import { Request } from "express";

@Controller("transaction")
export class TransactionController {
  private readonly logger = new CustomLogger(TransactionController.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly transactionService: TransactionService,
  ) {}

  @Post("initiate")
  initiatePayment(
    @Body()
    body: InitiateTransactionDto,
  ) {
    return this.transactionService.initiatePayment(body);
  }

  @Post("webhook/verify")
  async webhook(
    @Req() req: Request,
    @Headers("x-paystack-signature") signature: string,
    @Body() body: PaystackWebhookPayload,
  ) {
    // const whitelist = this.configService
    //   .get<string>("PAYSTACK_WEBHOOK_IP_WHITELIST")
    //   .split(",");
    // if (
    //   this.configService.get("NODE_ENV") === "development" ||
    //   whitelist.includes(req.ip)
    // ) {
    const secret = this.configService.get<string>("PAYSTACK_SECRET_KEY");
    const { createHmac } = await import("node:crypto");
    const hash = createHmac("sha512", secret)
      .update(JSON.stringify(body))
      .digest("hex");
    if (hash === signature) {
      console.log(body);
      return this.transactionService.verifyPayment(body);
    } else {
      this.logger.warn(`Invalid signature: ${signature}`);
      return {
        success: false,
        message: "Invalid signature",
      };
    }
    // } else {
    //   this.logger.warn(`Invalid IP: ${req.ip}`);
    //   return {
    //     success: false,
    //     message: "Invalid IP",
    //   };
    // }
  }
}
