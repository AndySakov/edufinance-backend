import { Inject, Injectable } from "@nestjs/common";
import { CreateProgrammeDto } from "./dto/create-programme.dto";
import { UpdateProgrammeDto } from "./dto/update-programme.dto";
import { DRIZZLE, Database } from "src/db";
import { CustomLogger } from "src/shared/utils/custom-logger";
import { programmes } from "src/db/programmes";
import { and, eq } from "drizzle-orm";
import { randomProgrammeId } from "src/shared/helpers/random";
import { data } from "src/shared/interfaces";
import { studentsToProgrammes } from "src/db/students-to-programmes";
import { billTypes } from "src/db/bill-types";
import { billsToPayees } from "src/db/bills-to-payees";

@Injectable()
export class ProgrammesService {
  private readonly logger = new CustomLogger(ProgrammesService.name);
  constructor(
    @Inject(DRIZZLE)
    private readonly drizzle: Database,
  ) {}

  async create(createProgrammeDto: CreateProgrammeDto) {
    try {
      const programmeId = randomProgrammeId();
      await this.drizzle.insert(programmes).values({
        programmeId,
        name: createProgrammeDto.name,
      });
      return {
        success: true,
        message: "Programme created",
        data: data(await this.findByProgrammeId(programmeId)),
      };
    } catch (error) {
      this.logger.error(`Error creating programme: ${error}`);
      return {
        success: false,
        message: "Error creating programme",
      };
    }
  }

  async findAll() {
    try {
      const programmes = await this.drizzle.query.programmes.findMany({
        columns: {
          id: true,
          programmeId: true,
          name: true,
        },
      });
      return {
        success: true,
        message: "Programmes found",
        data: programmes,
      };
    } catch (error) {
      this.logger.error(`Error finding programmes: ${error}`);
      return {
        success: false,
        message: "Error finding programmes",
      };
    }
  }

  async findOne(id: number) {
    try {
      const programme = await this.drizzle.query.programmes.findFirst({
        where: eq(programmes.id, id),
        columns: {
          id: true,
          programmeId: true,
          name: true,
        },
      });
      if (programme) {
        return {
          success: true,
          message: "Programme found",
          data: programme,
        };
      } else {
        return {
          success: false,
          message: "Programme not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error finding programme: ${error}`);
      return {
        success: false,
        message: "Error finding programme",
      };
    }
  }

  async findByProgrammeId(id: string) {
    try {
      const programme = await this.drizzle.query.programmes.findFirst({
        where: eq(programmes.programmeId, id),
        columns: {
          id: true,
          programmeId: true,
          name: true,
        },
      });
      if (programme) {
        return {
          success: true,
          message: "Programme found",
          data: programme,
        };
      } else {
        return {
          success: false,
          message: "Programme not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error finding programme: ${error}`);
      return {
        success: false,
        message: "Error finding programme",
      };
    }
  }

  async update(id: number, updateProgrammeDto: UpdateProgrammeDto) {
    try {
      const existingProgramme = await this.findOne(id);
      if (existingProgramme) {
        await this.drizzle
          .update(programmes)
          .set({
            name: updateProgrammeDto.name,
            updatedAt: new Date(),
          })
          .where(eq(programmes.id, id));
        return {
          success: true,
          message: "Programme updated",
        };
      } else {
        return {
          success: false,
          message: "Programme not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error updating programme: ${error}`);
      return {
        success: false,
        message: "Error updating programme",
      };
    }
  }

  async remove(id: number) {
    try {
      const existingProgramme = await this.findOne(id);
      if (existingProgramme) {
        await this.drizzle.delete(programmes).where(eq(programmes.id, id));
        return {
          success: true,
          message: "Programme removed",
        };
      } else {
        return {
          success: false,
          message: "Programme not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error removing programme: ${error}`);
      return {
        success: false,
        message: "Error removing programme",
      };
    }
  }

  async addStudentToProgramme(
    programmeId: bigint | number,
    studentId: bigint | number,
  ): Promise<void> {
    try {
      const existingRelation = await this.findStudentInProgramme(
        programmeId,
        studentId,
      );
      if (!existingRelation) {
        await this.drizzle.insert(studentsToProgrammes).values({
          studentId: BigInt(studentId),
          programmeId: BigInt(programmeId),
        });

        const prelims = await this.drizzle.query.billTypes.findMany({
          where: eq(billTypes.programmeId, BigInt(programmeId)),
          columns: {},
          with: {
            bills: {
              columns: {
                id: true,
              },
            },
          },
        });

        const pendingBills: { id: number }[] = prelims.reduce(
          (acc, curr) => [...acc, ...curr.bills],
          [],
        );

        if (pendingBills.length > 0) {
          await this.drizzle.insert(billsToPayees).values(
            pendingBills.map(bill => ({
              billId: BigInt(bill.id),
              payeeId: BigInt(studentId),
            })),
          );
        }
      }
    } catch (error) {
      this.logger.error(`Error adding student to programme: ${error}`);
    }
  }

  async findStudentInProgramme(
    programmeId: bigint | number,
    studentId: bigint | number,
  ) {
    try {
      const relation = await this.drizzle.query.studentsToProgrammes.findFirst({
        where: and(
          eq(studentsToProgrammes.studentId, BigInt(studentId)),
          eq(studentsToProgrammes.programmeId, BigInt(programmeId)),
        ),
      });
      if (relation) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.logger.error(`Error finding student in programme: ${error}`);
      return false;
    }
  }

  async removeStudentFromProgramme(
    programmeId: bigint | number,
    studentId: bigint | number,
  ): Promise<void> {
    try {
      await this.drizzle
        .delete(studentsToProgrammes)
        .where(
          and(
            eq(studentsToProgrammes.studentId, BigInt(studentId)),
            eq(studentsToProgrammes.programmeId, BigInt(programmeId)),
          ),
        );
    } catch (error) {
      this.logger.error(`Error removing student from programme: ${error}`);
    }
  }
}
