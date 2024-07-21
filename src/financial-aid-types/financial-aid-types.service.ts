import { Inject, Injectable } from "@nestjs/common";
import { CreateFinancialAidTypeDto } from "./dto/create-financial-aid-type.dto";
import { UpdateFinancialAidTypeDto } from "./dto/update-financial-aid-type.dto";
import { DRIZZLE, Database } from "src/db";
import { CustomLogger } from "src/shared/utils/custom-logger";
import { financialAidTypes } from "src/db/financial-aid-types";
import { eq } from "drizzle-orm";

@Injectable()
export class FinancialAidTypesService {
  private readonly logger = new CustomLogger(FinancialAidTypesService.name);
  constructor(
    @Inject(DRIZZLE)
    private readonly drizzle: Database,
  ) {}

  async create(createFinancialAidTypeDto: CreateFinancialAidTypeDto) {
    try {
      await this.drizzle.insert(financialAidTypes).values({
        name: createFinancialAidTypeDto.name,
      });
      return {
        success: true,
        message: "Financial aid type created",
      };
    } catch (error) {
      this.logger.error(`Error creating financial aid type: ${error}`);
      return {
        success: false,
        message: "Error creating financial aid type",
      };
    }
  }

  async findAll() {
    try {
      const financialAidTypes =
        await this.drizzle.query.financialAidTypes.findMany({
          columns: {
            id: true,
            name: true,
          },
        });
      return {
        success: true,
        message: "Financial aid types found",
        data: financialAidTypes,
      };
    } catch (error) {
      this.logger.error(`Error finding financial aid types: ${error}`);
      return {
        success: false,
        message: "Error finding financial aid types",
      };
    }
  }

  async findOne(id: number) {
    try {
      const financialAidType =
        await this.drizzle.query.financialAidTypes.findFirst({
          where: eq(financialAidTypes.id, id),
          columns: {
            id: true,
            name: true,
          },
        });
      if (financialAidType) {
        return {
          success: true,
          message: "Financial aid type found",
          data: financialAidType,
        };
      } else {
        return {
          success: false,
          message: "Financial aid type not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error finding financial aid type: ${error}`);
      return {
        success: false,
        message: "Error finding financial aid type",
      };
    }
  }

  async update(
    id: number,
    updateFinancialAidTypeDto: UpdateFinancialAidTypeDto,
  ) {
    try {
      const existingFinancialAidType = await this.findOne(id);
      if (existingFinancialAidType) {
        await this.drizzle
          .update(financialAidTypes)
          .set({
            name: updateFinancialAidTypeDto.name,
            updatedAt: new Date(),
          })
          .where(eq(financialAidTypes.id, id));
        return {
          success: true,
          message: "Financial aid type updated",
        };
      } else {
        return {
          success: false,
          message: "Financial aid type not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error updating financial aid type: ${error}`);
      return {
        success: false,
        message: "Error updating financial aid type",
      };
    }
  }

  async remove(id: number) {
    try {
      const existingFinancialAidType = await this.findOne(id);
      if (existingFinancialAidType) {
        await this.drizzle
          .delete(financialAidTypes)
          .where(eq(financialAidTypes.id, id));
        return {
          success: true,
          message: "Financial aid type removed",
        };
      } else {
        return {
          success: false,
          message: "Financial aid type not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error removing financial aid type: ${error}`);
      return {
        success: false,
        message: "Error removing financial aid type",
      };
    }
  }
}
