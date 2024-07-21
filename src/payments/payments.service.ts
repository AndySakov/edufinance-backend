import { Inject, Injectable } from "@nestjs/common";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { Database, DRIZZLE } from "src/db";
import { CustomLogger } from "src/shared/utils/custom-logger";
import { payments } from "src/db/payments";
import { eq } from "drizzle-orm";

@Injectable()
export class PaymentsService {
  private readonly logger = new CustomLogger(PaymentsService.name);
  constructor(
    @Inject(DRIZZLE)
    private readonly drizzle: Database,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      await this.drizzle.insert(payments).values({
        billId: BigInt(createPaymentDto.billId),
        payerId: BigInt(createPaymentDto.payerId),
        paymentTypeId: BigInt(createPaymentDto.paymentTypeId),
        paymentReference: createPaymentDto.paymentReference,
        status: createPaymentDto.status,
        paymentNote: createPaymentDto.paymentNote,
        amount: createPaymentDto.amount,
        createdAt: createPaymentDto.createdAt,
        updatedAt: createPaymentDto.updatedAt,
      });
      return {
        success: true,
        message: "Payment created",
      };
    } catch (error) {
      this.logger.error(`Error creating payment: ${error}`);
      return {
        success: false,
        message: "Error creating payment",
      };
    }
  }

  async findAll() {
    try {
      const payments = await this.drizzle.query.payments.findMany({
        columns: {
          id: true,
          paymentReference: true,
          status: true,
          paymentNote: true,
          amount: true,
          createdAt: true,
          updatedAt: true,
        },
        with: {
          bill: {
            columns: {
              name: true,
            },
          },
          payer: {
            columns: {
              firstName: true,
              lastName: true,
            },
          },
          type: {
            columns: {
              name: true,
            },
          },
        },
      });
      return {
        success: true,
        message: "Payments found",
        data: payments.map(p => ({
          id: p.id,
          bill: p.bill.name,
          payer: `${p.payer.firstName} ${p.payer.lastName}`,
          paymentType: p.type.name,
          paymentReference: p.paymentReference,
          status: p.status,
          paymentNote: p.paymentNote,
          amount: p.amount,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })),
      };
    } catch (error) {
      this.logger.error(`Error finding payments: ${error}`);
      return {
        success: false,
        message: "Error finding payments",
      };
    }
  }

  async findByReference(reference: string) {
    try {
      const payment = await this.drizzle.query.payments.findFirst({
        where: eq(payments.paymentReference, reference),
        columns: {
          id: true,
          paymentReference: true,
          status: true,
          paymentNote: true,
          amount: true,
          createdAt: true,
          updatedAt: true,
        },
        with: {
          bill: {
            columns: {
              name: true,
            },
          },
          payer: {
            columns: {
              firstName: true,
              lastName: true,
            },
          },
          type: {
            columns: {
              name: true,
            },
          },
        },
      });
      if (payment) {
        return {
          success: true,
          message: "Payment found",
          data: {
            id: payment.id,
            bill: payment.bill.name,
            payer: `${payment.payer.firstName} ${payment.payer.lastName}`,
            paymentType: payment.type.name,
            paymentReference: payment.paymentReference,
            status: payment.status,
            paymentNote: payment.paymentNote,
            amount: payment.amount,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
          },
        };
      } else {
        return {
          success: false,
          message: "Payment not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error finding payment: ${error}`);
      return {
        success: false,
        message: "Error finding payment",
      };
    }
  }

  async findOne(id: number) {
    try {
      const payment = await this.drizzle.query.payments.findFirst({
        where: eq(payments.id, id),
        columns: {
          id: true,
          paymentReference: true,
          status: true,
          paymentNote: true,
          amount: true,
          createdAt: true,
          updatedAt: true,
        },
        with: {
          bill: {
            columns: {
              name: true,
            },
          },
          payer: {
            columns: {
              firstName: true,
              lastName: true,
            },
          },
          type: {
            columns: {
              name: true,
            },
          },
        },
      });
      if (payment) {
        return {
          success: true,
          message: "Payment found",
          data: {
            id: payment.id,
            bill: payment.bill.name,
            payer: `${payment.payer.firstName} ${payment.payer.lastName}`,
            paymentType: payment.type.name,
            paymentReference: payment.paymentReference,
            status: payment.status,
            paymentNote: payment.paymentNote,
            amount: payment.amount,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
          },
        };
      } else {
        return {
          success: false,
          message: "Payment not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error finding payment: ${error}`);
      return {
        success: false,
        message: "Error finding payment",
      };
    }
  }

  async updateStatus(
    id: number,
    status: "pending" | "paid" | "failed" | "refunded",
    note?: string,
  ) {
    try {
      const existingPayment = await this.findOne(id);
      if (existingPayment) {
        await this.drizzle
          .update(payments)
          .set({
            status: status,
            paymentNote: note ? note : existingPayment.data.paymentNote,
            updatedAt: new Date(),
          })
          .where(eq(payments.id, id));
        return {
          success: true,
          message: "Payment status updated",
        };
      } else {
        return {
          success: false,
          message: "Payment not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error updating payment status: ${error}`);
      return {
        success: false,
        message: "Error updating payment status",
      };
    }
  }
}
