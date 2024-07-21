import { Inject, Injectable } from "@nestjs/common";
import { CreatePaymentCategoryDto } from "./dto/create-payment-category.dto";
import { UpdatePaymentCategoryDto } from "./dto/update-payment-category.dto";
import { CustomLogger } from "src/shared/utils/custom-logger";
import { Database, DRIZZLE } from "src/db";
import { paymentTypes } from "src/db/payment-types";
import { eq } from "drizzle-orm";

@Injectable()
export class PaymentCategoryService {
  private readonly logger = new CustomLogger(PaymentCategoryService.name);
  constructor(
    @Inject(DRIZZLE)
    private readonly drizzle: Database,
  ) {}

  async create(createPaymentCategoryDto: CreatePaymentCategoryDto) {
    try {
      await this.drizzle.insert(paymentTypes).values({
        name: createPaymentCategoryDto.name,
      });
      return {
        success: true,
        message: "Payment category created",
      };
    } catch (error) {
      this.logger.error(`Error creating payment category: ${error}`);
      return {
        success: false,
        message: "Error creating payment category",
      };
    }
  }

  async seedPaystack() {
    const existingPaymentCategory = await this.findByName("Paystack");
    if (existingPaymentCategory.success) {
      this.logger.log("Paystack payment category already exists. Skipping...");
    } else {
      await this.drizzle.insert(paymentTypes).values({
        name: "Paystack",
      });
      this.logger.log("Paystack payment category created");
    }
  }

  async findByName(name: string) {
    try {
      const paymentCategory = await this.drizzle.query.paymentTypes.findFirst({
        where: eq(paymentTypes.name, name),
        columns: {
          id: true,
          name: true,
        },
      });
      if (paymentCategory) {
        return {
          success: true,
          message: "Payment category found",
          data: paymentCategory,
        };
      } else {
        return {
          success: false,
          message: "Payment category not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error finding payment category: ${error}`);
      return {
        success: false,
        message: "Error finding payment category",
      };
    }
  }

  async findAll() {
    try {
      const paymentCategories = await this.drizzle.query.paymentTypes.findMany({
        columns: {
          id: true,
          name: true,
        },
      });
      return {
        success: true,
        message: "Payment categories found",
        data: paymentCategories,
      };
    } catch (error) {
      this.logger.error(`Error finding payment categories: ${error}`);
      return {
        success: false,
        message: "Error finding payment categories",
      };
    }
  }

  async findOne(id: number) {
    try {
      const paymentCategory = await this.drizzle.query.paymentTypes.findFirst({
        where: eq(paymentTypes.id, id),
        columns: {
          id: true,
          name: true,
        },
      });
      if (paymentCategory) {
        return {
          success: true,
          message: "Payment category found",
          data: paymentCategory,
        };
      } else {
        return {
          success: false,
          message: "Payment category not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error finding payment category: ${error}`);
      return {
        success: false,
        message: "Error finding payment category",
      };
    }
  }

  async update(id: number, updatePaymentCategoryDto: UpdatePaymentCategoryDto) {
    try {
      const existingPaymentCategory = await this.findOne(id);
      if (existingPaymentCategory) {
        await this.drizzle
          .update(paymentTypes)
          .set({
            name: updatePaymentCategoryDto.name,
            updatedAt: new Date(),
          })
          .where(eq(paymentTypes.id, id));
        return {
          success: true,
          message: "Payment category updated",
        };
      } else {
        return {
          success: false,
          message: "Payment category not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error updating payment category: ${error}`);
      return {
        success: false,
        message: "Error updating payment category",
      };
    }
  }

  async remove(id: number) {
    try {
      const existingPaymentCategory = await this.findOne(id);
      if (existingPaymentCategory) {
        await this.drizzle.delete(paymentTypes).where(eq(paymentTypes.id, id));
        return {
          success: true,
          message: "Payment category removed",
        };
      } else {
        return {
          success: false,
          message: "Payment category not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error removing payment category: ${error}`);
      return {
        success: false,
        message: "Error removing payment category",
      };
    }
  }
}
