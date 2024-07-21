import { Inject, Injectable } from "@nestjs/common";
import { CreateFinancialAidDiscountDto } from "./dto/create-financial-aid-discount.dto";
import { UpdateFinancialAidDiscountDto } from "./dto/update-financial-aid-discount.dto";
import { DRIZZLE, Database } from "src/db";
import { CustomLogger } from "src/shared/utils/custom-logger";
import { financialAidDiscounts } from "src/db/financial-aid-discounts";
import { FinancialAidTypesService } from "src/financial-aid-types/financial-aid-types.service";
import { eq } from "drizzle-orm";

@Injectable()
export class FinancialAidDiscountsService {
  private readonly logger = new CustomLogger(FinancialAidDiscountsService.name);
  constructor(
    @Inject(DRIZZLE)
    private readonly drizzle: Database,
    private readonly financialAidTypesService: FinancialAidTypesService,
  ) {}

  async create(createFinancialAidDiscountDto: CreateFinancialAidDiscountDto) {
    try {
      const existingFinancialAidType =
        await this.financialAidTypesService.findOne(
          createFinancialAidDiscountDto.financialAidTypeId,
        );
      if (existingFinancialAidType) {
        await this.drizzle.insert(financialAidDiscounts).values({
          name: createFinancialAidDiscountDto.name,
          billTypeId: BigInt(createFinancialAidDiscountDto.billTypeId),
          financialAidTypeId: BigInt(
            createFinancialAidDiscountDto.financialAidTypeId,
          ),
          amount: createFinancialAidDiscountDto.amount / 100,
        });
        return {
          success: true,
          message: "Financial aid discount created",
        };
      } else {
        return {
          success: false,
          message: "Financial aid type not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error creating financial aid discount: ${error}`);
      return {
        success: false,
        message: "Error creating financial aid discount",
      };
    }
  }

  async findAll() {
    try {
      const financialAidDiscounts =
        await this.drizzle.query.financialAidDiscounts.findMany({
          columns: {
            id: true,
            name: true,
            billTypeId: true,
            financialAidTypeId: true,
            amount: true,
          },
          with: {
            billType: {
              columns: {
                name: true,
              },
            },
            financialAidType: {
              columns: {
                name: true,
              },
            },
          },
        });
      return {
        success: true,
        message: "Financial aid discounts found",
        data: financialAidDiscounts.map(financialAidDiscount => ({
          id: financialAidDiscount.id,
          name: financialAidDiscount.name,
          billType: financialAidDiscount.billType.name,
          financialAidType: financialAidDiscount.financialAidType.name,
          amount: financialAidDiscount.amount,
        })),
      };
    } catch (error) {
      this.logger.error(`Error finding financial aid discounts: ${error}`);
      return {
        success: false,
        message: "Error finding financial aid discounts",
      };
    }
  }

  async findOne(id: number) {
    try {
      const financialAidDiscount =
        await this.drizzle.query.financialAidDiscounts.findFirst({
          where: eq(financialAidDiscounts.id, id),
          columns: {
            id: true,
            name: true,
            billTypeId: true,
            financialAidTypeId: true,
            amount: true,
          },
          with: {
            billType: {
              columns: {
                name: true,
              },
            },
            financialAidType: {
              columns: {
                name: true,
              },
            },
          },
        });
      if (financialAidDiscount) {
        return {
          success: true,
          message: "Financial aid discount found",
          data: {
            id: financialAidDiscount.id,
            name: financialAidDiscount.name,
            billType: financialAidDiscount.billType.name,
            financialAidType: financialAidDiscount.financialAidType.name,
            amount: financialAidDiscount.amount,
          },
        };
      } else {
        return {
          success: false,
          message: "Financial aid discount not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error finding financial aid discount: ${error}`);
      return {
        success: false,
        message: "Error finding financial aid discount",
      };
    }
  }

  async update(
    id: number,
    updateFinancialAidDiscountDto: UpdateFinancialAidDiscountDto,
  ) {
    try {
      const existingFinancialAidDiscount = await this.findOne(id);
      if (existingFinancialAidDiscount) {
        await this.drizzle
          .update(financialAidDiscounts)
          .set({
            name: updateFinancialAidDiscountDto.name,
            billTypeId: BigInt(updateFinancialAidDiscountDto.billTypeId),
            financialAidTypeId: BigInt(
              updateFinancialAidDiscountDto.financialAidTypeId,
            ),
            amount: updateFinancialAidDiscountDto.amount,
            updatedAt: new Date(),
          })
          .where(eq(financialAidDiscounts.id, id));
        return {
          success: true,
          message: "Financial aid discount updated",
        };
      } else {
        return {
          success: false,
          message: "Financial aid discount not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error updating financial aid discount: ${error}`);
      return {
        success: false,
        message: "Error updating financial aid discount",
      };
    }
  }

  async remove(id: number) {
    try {
      const existingFinancialAidDiscount = await this.findOne(id);
      if (existingFinancialAidDiscount) {
        await this.drizzle
          .delete(financialAidDiscounts)
          .where(eq(financialAidDiscounts.id, id));
        return {
          success: true,
          message: "Financial aid discount removed",
        };
      } else {
        return {
          success: false,
          message: "Financial aid discount not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error removing financial aid discount: ${error}`);
      return {
        success: false,
        message: "Error removing financial aid discount",
      };
    }
  }
}
