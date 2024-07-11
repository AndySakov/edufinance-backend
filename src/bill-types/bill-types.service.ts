import { Inject, Injectable } from "@nestjs/common";
import { CreateBillTypeDto } from "./dto/create-bill-type.dto";
import { UpdateBillTypeDto } from "./dto/update-bill-type.dto";
import { Database, DRIZZLE } from "src/db";
import { billTypes } from "src/db/bill-types";
import { eq } from "drizzle-orm";
import { CustomLogger } from "src/shared/utils/custom-logger";
import { data } from "src/shared/interfaces";

@Injectable()
export class BillTypesService {
  private readonly logger = new CustomLogger(BillTypesService.name);
  constructor(
    @Inject(DRIZZLE)
    private readonly drizzle: Database,
  ) {}

  async create(createBillTypeDto: CreateBillTypeDto) {
    try {
      await this.drizzle.insert(billTypes).values({
        name: createBillTypeDto.name,
      });
      return {
        success: true,
        message: "Bill type created",
      };
    } catch (error) {
      this.logger.error(`Error creating bill type: ${error}`);
      return {
        success: false,
        message: "Error creating bill type",
      };
    }
  }

  async findAll() {
    try {
      const billTypes = await this.drizzle.query.billTypes.findMany({
        columns: {
          id: true,
          name: true,
        },
      });
      return {
        success: true,
        message: "Bill types found",
        data: billTypes,
      };
    } catch (error) {
      this.logger.error(`Error finding bill types: ${error}`);
      return {
        success: false,
        message: "Error finding bill types",
      };
    }
  }

  async findOne(id: number) {
    try {
      const billType = await this.drizzle.query.billTypes.findFirst({
        where: eq(billTypes.id, id),
        columns: {
          id: true,
          name: true,
        },
      });
      if (billType) {
        return {
          success: true,
          message: "Bill type found",
          data: billType,
        };
      } else {
        return {
          success: false,
          message: "Bill type not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error finding bill type: ${error}`);
      return {
        success: false,
        message: "Error finding bill type",
      };
    }
  }

  async update(id: number, updateBillTypeDto: UpdateBillTypeDto) {
    try {
      const existingBillType = data(await this.findOne(id));
      if (existingBillType) {
        await this.drizzle
          .update(billTypes)
          .set({
            name: updateBillTypeDto.name,
          })
          .where(eq(billTypes.id, id));
        return {
          success: true,
          message: "Bill type updated",
        };
      } else {
        return {
          success: false,
          message: "Bill type not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error updating bill type: ${error}`);
      return {
        success: false,
        message: "Error updating bill type",
      };
    }
  }

  async remove(id: number) {
    try {
      const existingBillType = data(await this.findOne(id));
      if (existingBillType) {
        await this.drizzle.delete(billTypes).where(eq(billTypes.id, id));
        return {
          success: true,
          message: "Bill type removed",
        };
      } else {
        return {
          success: false,
          message: "Bill type not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error removing bill type: ${error}`);
      return {
        success: false,
        message: "Error removing bill type",
      };
    }
  }
}
