import { Inject, Injectable } from "@nestjs/common";
import { CreateBillDto } from "./dto/create-bill.dto";
import { UpdateBillDto } from "./dto/update-bill.dto";
import { Database, DRIZZLE } from "src/db";
import { eq } from "drizzle-orm";
import { CustomLogger } from "src/shared/utils/custom-logger";
import { data } from "src/shared/interfaces";
import { bills } from "src/db/bills";
import { billTypes } from "src/db/bill-types";
import { billsToPayees } from "src/db/bills-to-payees";
import { MailService } from "src/mail/mail.service";
import { generateNewBillEmail } from "src/shared/helpers/email-generators";

@Injectable()
export class BillsService {
  private readonly logger = new CustomLogger(BillsService.name);
  constructor(
    @Inject(DRIZZLE)
    private readonly drizzle: Database,
    private readonly mailService: MailService,
  ) {}

  async create(createBillDto: CreateBillDto) {
    try {
      const programme = await this.drizzle.query.billTypes.findFirst({
        where: eq(billTypes.id, createBillDto.billTypeId),
        columns: {},
        with: {
          programme: {
            columns: {},
            with: {
              studentsToProgrammes: {
                columns: {
                  studentId: true,
                },
                with: {
                  student: {
                    columns: {
                      firstName: true,
                    },
                    with: {
                      user: {
                        columns: {
                          email: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      const [res, _] = await this.drizzle.insert(bills).values({
        name: createBillDto.name,
        amountDue: createBillDto.amountDue / 100,
        dueDate: new Date(createBillDto.dueDate),
        installmentSupported: createBillDto.installmentSupported,
        maxInstallments: createBillDto.maxInstallments,
        billTypeId: BigInt(createBillDto.billTypeId),
      });

      await this.drizzle.insert(billsToPayees).values(
        programme.programme.studentsToProgrammes.map(stp => ({
          billId: BigInt(res.insertId),
          payeeId: BigInt(stp.studentId),
        })),
      );

      for (const targetedPayee of programme.programme.studentsToProgrammes) {
        await this.mailService.sendMail({
          to: targetedPayee.student.user.email,
          subject: "New bill created for you",
          html: generateNewBillEmail(
            targetedPayee.student.firstName,
            new Date(createBillDto.dueDate),
          ),
        });
      }

      return {
        success: true,
        message: "Bill created",
      };
    } catch (error) {
      this.logger.error(`Error creating bill: ${error}`);
      return {
        success: false,
        message: "Error creating bill",
      };
    }
  }

  async findAll() {
    try {
      const bills = await this.drizzle.query.bills.findMany({
        columns: {
          id: true,
          name: true,
          amountDue: true,
          dueDate: true,
          installmentSupported: true,
          maxInstallments: true,
        },
        with: {
          billType: {
            columns: {
              name: true,
            },
          },
        },
      });
      return {
        success: true,
        message: "Bills found",
        data: bills.map(bill => ({
          id: bill.id,
          name: bill.name,
          amountDue: bill.amountDue,
          dueDate: bill.dueDate,
          installmentSupported: bill.installmentSupported,
          maxInstallments: bill.maxInstallments,
          billType: bill.billType.name,
        })),
      };
    } catch (error) {
      this.logger.error(`Error finding bills: ${error}`);
      return {
        success: false,
        message: "Error finding bills",
      };
    }
  }

  async findOne(id: number) {
    try {
      const bill = await this.drizzle.query.bills.findFirst({
        where: eq(bills.id, id),
        columns: {
          id: true,
          name: true,
          amountDue: true,
          dueDate: true,
          installmentSupported: true,
          maxInstallments: true,
        },
        with: {
          billType: {
            columns: {
              name: true,
            },
          },
        },
      });
      if (bill) {
        return {
          success: true,
          message: "Bill found",
          data: {
            id: bill.id,
            name: bill.name,
            amountDue: bill.amountDue,
            dueDate: bill.dueDate,
            installmentSupported: bill.installmentSupported,
            maxInstallments: bill.maxInstallments,
            billType: bill.billType.name,
          },
        };
      } else {
        return {
          success: false,
          message: "Bill not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error finding bill: ${error}`);
      return {
        success: false,
        message: "Error finding bill",
      };
    }
  }

  async update(id: number, updateBillDto: UpdateBillDto) {
    try {
      const existingBill = data(await this.findOne(id));
      if (existingBill) {
        await this.drizzle
          .update(bills)
          .set({
            name: updateBillDto.name,
            amountDue: updateBillDto.amountDue / 100,
            dueDate: new Date(updateBillDto.dueDate),
            installmentSupported: updateBillDto.installmentSupported,
            maxInstallments: updateBillDto.maxInstallments,
            billTypeId: BigInt(updateBillDto.billTypeId),
            updatedAt: new Date(),
          })
          .where(eq(bills.id, id));
        return {
          success: true,
          message: "Bill updated",
        };
      } else {
        return {
          success: false,
          message: "Bill not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error updating bill: ${error}`);
      return {
        success: false,
        message: "Error updating bill",
      };
    }
  }

  async remove(id: number) {
    try {
      const existingBill = data(await this.findOne(id));
      if (existingBill) {
        await this.drizzle.delete(bills).where(eq(bills.id, id));
        return {
          success: true,
          message: "Bill removed",
        };
      } else {
        return {
          success: false,
          message: "Bill not found",
        };
      }
    } catch (error) {
      this.logger.error(`Error removing bill: ${error}`);
      return {
        success: false,
        message: "Error removing bill",
      };
    }
  }
}
