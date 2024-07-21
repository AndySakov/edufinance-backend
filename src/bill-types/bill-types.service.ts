import { Inject, Injectable } from "@nestjs/common";
import { CreateBillTypeDto } from "./dto/create-bill-type.dto";
import { UpdateBillTypeDto } from "./dto/update-bill-type.dto";
import { CustomLogger } from "src/shared/utils/custom-logger";
import { Database, DRIZZLE } from "src/db";
import { billTypes } from "src/db/bill-types";
import { eq } from "drizzle-orm";

@Injectable()
export class BillTypeService {
  private readonly logger = new CustomLogger(BillTypeService.name);
  constructor(
    @Inject(DRIZZLE)
    private readonly drizzle: Database,
  ) {}

  async create(createBillTypeDto: CreateBillTypeDto) {
    try {
      await this.drizzle.insert(billTypes).values({
        name: createBillTypeDto.name,
        programmeId: BigInt(createBillTypeDto.programmeId),
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
        with: {
          programme: {
            columns: {
              programmeId: false,
              name: true,
            },
          },
        },
      });
      return {
        success: true,
        message: "Bill types found",
        data: billTypes.map(billType => {
          const programme = billType?.programme;
          return {
            id: billType.id,
            name: billType.name,
            programme: programme ? programme.name : null,
          };
        }),
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
      const billType = await this.drizzle.query.billTypes.findFirst({
        where: eq(billTypes.id, id),
        columns: {
          id: true,
          name: true,
        },
        with: {
          programme: {
            columns: {
              programmeId: false,
              name: true,
            },
          },
        },
      });
      if (billType) {
        return {
          success: true,
          message: "Bill type found",
          data: {
            id: billType.id,
            name: billType.name,
            programme: billType?.programme?.name,
          },
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
      const existingBillType = await this.findOne(id);
      if (existingBillType) {
        await this.drizzle
          .update(billTypes)
          .set({
            name: updateBillTypeDto.name,
            programmeId: BigInt(updateBillTypeDto.programmeId),
            updatedAt: new Date(),
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
      const existingBillType = await this.findOne(id);
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
