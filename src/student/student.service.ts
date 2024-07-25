import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigOptions } from "cloudinary";
import { isAfter } from "date-fns";
import { and, desc, eq } from "drizzle-orm";
import { DRIZZLE, Database } from "src/db";
import { billsToPayees } from "src/db/bills-to-payees";
import { financialAidApplications } from "src/db/financial-aid-applications";
import { payments } from "src/db/payments";
import { users } from "src/db/users";
import { data } from "src/shared/interfaces";
import { CustomLogger } from "src/shared/utils/custom-logger";
import { StudentsService } from "src/students/students.service";
import { CreateFinancialAidApplicationDto } from "./dto/create-financial-aid-application.dto";
import { uploadFile } from "src/shared/helpers";

@Injectable()
export class StudentService {
  private readonly logger = new CustomLogger(StudentService.name);
  private cloudinaryConfig: ConfigOptions;
  constructor(
    @Inject(DRIZZLE)
    private readonly drizzle: Database,
    private readonly studentsService: StudentsService,
    readonly configService: ConfigService,
  ) {
    this.cloudinaryConfig = {
      cloud_name: configService.get<string>("CLOUDINARY_NAME"),
      api_key: configService.get<string>("CLOUDINARY_API_KEY"),
      api_secret: configService.get<string>("CLOUDINARY_API_SECRET"),
    };
  }

  async getStudentId(email: string) {
    const userDetails = await this.drizzle.query.users.findFirst({
      where: and(eq(users.email, email), eq(users.role, "student")),
      columns: {},
      with: {
        studentDetails: {
          columns: {
            id: true,
          },
        },
      },
    });
    return BigInt(userDetails?.studentDetails.id);
  }

  async getMyProfile(email: string) {
    const student = await this.drizzle.query.users.findFirst({
      where: eq(users.email, email),
      columns: {
        id: true,
      },
    });
    return {
      success: true,
      message: "Student profile found",
      data: {
        ...data(await this.studentsService.findOne(student.id)),
        financialAidInfo:
          data(await this.getMyFinancialAidInformation(email)) ?? null,
      },
    };
  }

  async getMyBillStats(email: string) {
    const bills = data(await this.getMyBills(email));
    const financialAidInfo = data(
      await this.getMyFinancialAidInformation(email),
    );

    const totalDiscounted =
      financialAidInfo?.discounts?.reduce(
        (acc, discount) => acc + discount.amount,
        0,
      ) ?? 0;

    const totalBills =
      bills?.reduce((acc, bill) => {
        return acc + bill.amountDue;
      }, 0) ?? 0;

    const totalPaid =
      bills?.reduce((acc, bill) => {
        return (
          acc +
          bill.payments
            ?.filter(x => x.status === "paid")
            .map(payment => {
              return payment.amount;
            })
            .reduce((acc, x) => acc + x, 0)
        );
      }, 0) ?? 0;

    const totalDue = totalBills - totalPaid - totalDiscounted;

    const totalOverDue =
      bills
        ?.filter(bill => {
          return isAfter(new Date(), bill.dueDate);
        })
        ?.reduce((acc, bill) => {
          return (
            acc +
            (bill.amountDue -
              bill.payments
                .filter(x => x.status === "paid")
                .map(payment => payment.amount)
                .reduce((acc, x) => acc + x, 0)) -
            (financialAidInfo?.discounts?.find(
              discount => discount.billType === bill.billType,
            )?.amount ?? 0)
          );
        }, 0) ?? 0;

    return {
      success: true,
      message: "Student dashboard stats found",
      data: {
        billCount: bills?.length ?? 0,
        paidBillCount:
          bills?.filter(bill => {
            const totalPaid = bill.payments
              .filter(x => x.status === "paid")
              .map(payment => payment.amount)
              .reduce((acc, x) => acc + x, 0);
            const totalDiscounted =
              financialAidInfo?.discounts?.find(
                discount => discount.billType === bill.billType,
              )?.amount ?? 0;
            return bill.amountDue - totalPaid - totalDiscounted === 0;
          })?.length ?? 0,
        unpaidBillCount:
          bills?.filter(bill => {
            const totalPaid =
              bill?.payments
                ?.filter(x => x.status === "paid")
                ?.map(payment => payment.amount)
                ?.reduce((acc, x) => acc + x, 0) ?? 0;
            const totalDiscounted =
              financialAidInfo?.discounts?.find(
                discount => discount.billType === bill.billType,
              )?.amount ?? 0;
            return bill.amountDue - totalPaid - totalDiscounted > 0;
          })?.length ?? 0,
        overdueBillCount:
          bills?.filter(bill => isAfter(new Date(), bill.dueDate))?.length ?? 0,
        totalBills,
        totalPaid,
        totalOverDue,
        totalUnpaid: totalDue,
        totalDiscounted,
      },
    };
  }

  async getMyPaymentStats(email: string) {
    const payments = data(await this.getMyPayments(email));

    const successfulPayments = payments.reduce((acc, payment) => {
      return acc + (payment.status === "paid" ? payment.amount : 0);
    }, 0);

    const failedPayments = payments.reduce((acc, payment) => {
      return acc + (payment.status === "failed" ? payment.amount : 0);
    }, 0);

    const refundedPayments = payments.reduce((acc, payment) => {
      return acc + (payment.status === "refunded" ? payment.amount : 0);
    }, 0);

    return {
      success: true,
      message: "Student payment stats found",
      data: {
        successfull: successfulPayments,
        failed: failedPayments,
        refunded: refundedPayments,
      },
    };
  }

  async getMyDashboardStats(email: string) {
    return {
      success: true,
      message: "Dashboard stats found",
      data: {
        billStats: data(await this.getMyBillStats(email)),
        paymentStats: data(await this.getMyPaymentStats(email)),
      },
    };
  }

  async getMyFinancialAidInformation(email: string) {
    const mostRecentSuccessful = data(await this.getMyApplications(email))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .find(a => a.status === "approved");

    if (mostRecentSuccessful) {
      const details =
        await this.drizzle.query.financialAidApplications.findFirst({
          where: eq(financialAidApplications.id, mostRecentSuccessful.id),
          columns: {},
          with: {
            type: {
              columns: {},
              with: {
                financialAidDiscounts: {
                  columns: {
                    name: true,
                    amount: true,
                  },
                  with: {
                    billType: {
                      columns: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
      if (details) {
        return {
          success: true,
          message: "Financial aid information found",
          data: {
            ...mostRecentSuccessful,
            discounts:
              details?.type?.financialAidDiscounts?.map(
                financialAidDiscount => ({
                  name: financialAidDiscount.name,
                  amount: financialAidDiscount.amount,
                  billType: financialAidDiscount.billType.name,
                }),
              ) ?? [],
          },
        };
      } else {
        return {
          success: false,
          message: "Unbale to find financial aid information",
          data: null,
        };
      }
    } else {
      return {
        success: false,
        message: "No successful financial aid application found",
        data: null,
      };
    }
  }

  async getMyApplications(email: string) {
    const id = await this.getStudentId(email);

    const results = await this.drizzle.query.financialAidApplications.findMany({
      where: eq(financialAidApplications.applicantId, BigInt(id)),
      columns: {
        id: true,
        householdIncome: true,
        hasReceivedPreviousFinancialAid: true,
        bankStatementUrl: true,
        coverLetterUrl: true,
        letterOfRecommendationUrl: true,
        status: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        type: {
          columns: {
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "Student applications found",
      data: results.map(financialAidApplication => ({
        id: financialAidApplication.id,
        householdIncome: financialAidApplication.householdIncome,
        hasReceivedPreviousFinancialAid:
          financialAidApplication.hasReceivedPreviousFinancialAid === 1,
        bankStatementUrl: financialAidApplication.bankStatementUrl,
        coverLetterUrl: financialAidApplication.coverLetterUrl,
        letterOfRecommendationUrl:
          financialAidApplication.letterOfRecommendationUrl,
        status: financialAidApplication.status,
        type: financialAidApplication?.type?.name ?? "N/A",
        startDate: financialAidApplication.startDate,
        endDate: financialAidApplication.endDate,
        createdAt: financialAidApplication.createdAt,
        updatedAt: financialAidApplication.updatedAt,
      })),
    };
  }

  async getMyBills(email: string) {
    try {
      const id = await this.getStudentId(email);

      const financialAidInfo = data(
        await this.getMyFinancialAidInformation(email),
      );

      const results = await this.drizzle.query.billsToPayees.findMany({
        where: eq(billsToPayees.payeeId, BigInt(id)),
        columns: {},
        with: {
          bill: {
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
                with: {
                  discounts: {
                    columns: {
                      name: true,
                      amount: true,
                    },
                    with: {
                      financialAidType: {
                        columns: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
              payments: {
                where: eq(payments.payerId, id),
                columns: {
                  status: true,
                  amount: true,
                },
                with: {
                  type: {
                    columns: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return {
        success: true,
        message: "Student bills found",
        data: results.map(res => ({
          id: res.bill.id,
          name: res.bill.name,
          dueDate: res.bill.dueDate,
          amountDue: res.bill.amountDue,
          billType: res.bill.billType.name,
          maxInstallments: res.bill.maxInstallments,
          installmentSupported: res.bill.installmentSupported,
          payments:
            res?.bill?.payments?.map(payment => ({
              status: payment.status,
              amount: payment.amount,
              type: payment.type.name,
            })) ?? [],
          discounts:
            res?.bill?.billType?.discounts
              ?.filter(
                discount =>
                  discount?.financialAidType?.name === financialAidInfo?.type,
              )
              .map(discount => ({
                name: discount.name,
                amount: discount.amount,
              })) ?? [],
        })),
      };
    } catch (error) {
      this.logger.error(`Error finding student bills: ${error}`);
      return {
        success: false,
        message: "Error finding student bills",
      };
    }
  }

  async getMyPayments(email: string) {
    const id = await this.getStudentId(email);

    const financialAidInfo = data(
      await this.getMyFinancialAidInformation(email),
    );

    const results = await this.drizzle.query.payments.findMany({
      where: eq(payments.payerId, BigInt(id)),
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
              with: {
                discounts: {
                  columns: {
                    name: true,
                    amount: true,
                  },
                  with: {
                    financialAidType: {
                      columns: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
            payments: {
              where: eq(payments.payerId, id),
              columns: {
                status: true,
                amount: true,
              },
              with: {
                type: {
                  columns: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        type: {
          columns: {
            name: true,
          },
        },
      },
      orderBy: desc(payments.updatedAt),
    });
    return {
      success: true,
      message: "Student payments found",
      data: results.map(payment => ({
        id: payment.id,
        billName: payment.bill.name,
        bill: {
          id: payment.bill.id,
          name: payment.bill.name,
          dueDate: payment.bill.dueDate,
          amountDue: payment.bill.amountDue,
          billType: payment.bill.billType.name,
          maxInstallments: payment.bill.maxInstallments,
          installmentSupported: payment.bill.installmentSupported,
          payments:
            payment?.bill?.payments?.map(payment => ({
              status: payment.status,
              amount: payment.amount,
              type: payment.type.name,
            })) ?? [],
          discounts:
            payment?.bill?.billType?.discounts
              ?.filter(
                discount =>
                  discount.financialAidType.name === financialAidInfo.type,
              )
              .map(discount => ({
                name: discount.name,
                amount: discount.amount,
              })) ?? [],
        },
        paymentType: payment.type.name,
        paymentReference: payment.paymentReference,
        status: payment.status,
        paymentNote: payment.paymentNote,
        amount: payment.amount,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      })),
    };
  }

  async getMyPaymentByReference(email: string, reference: string) {
    const id = await this.getStudentId(email);

    const financialAidInfo = data(
      await this.getMyFinancialAidInformation(email),
    );

    const student = data(await this.getMyProfile(email));

    const payment = await this.drizzle.query.payments.findFirst({
      where: and(
        eq(payments.payerId, BigInt(id)),
        eq(payments.paymentReference, reference),
      ),
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
              with: {
                discounts: {
                  columns: {
                    name: true,
                    amount: true,
                  },
                  with: {
                    financialAidType: {
                      columns: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
            payments: {
              where: eq(payments.payerId, id),
              columns: {
                status: true,
                amount: true,
              },
              with: {
                type: {
                  columns: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        type: {
          columns: {
            name: true,
          },
        },
      },
      orderBy: desc(payments.updatedAt),
    });

    if (payment) {
      return {
        success: true,
        message: "Student payment found",
        data: {
          id: payment.id,
          studentName:
            student.details.firstName + " " + student.details.lastName,
          billName: payment.bill.name,
          bill: {
            id: payment.bill.id,
            name: payment.bill.name,
            dueDate: payment.bill.dueDate,
            amountDue: payment.bill.amountDue,
            billType: payment.bill.billType.name,
            maxInstallments: payment.bill.maxInstallments,
            installmentSupported: payment.bill.installmentSupported,
            payments:
              payment?.bill?.payments?.map(payment => ({
                status: payment.status,
                amount: payment.amount,
                type: payment.type.name,
              })) ?? [],
            discounts:
              payment?.bill?.billType?.discounts
                ?.filter(
                  discount =>
                    discount.financialAidType.name === financialAidInfo.type,
                )
                .map(discount => ({
                  name: discount.name,
                  amount: discount.amount,
                })) ?? [],
          },
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
        message: "Student payment not found",
      };
    }
  }

  async applyForFinancialAid(
    email: string,
    body: CreateFinancialAidApplicationDto,
    files: {
      bankStatement: Express.Multer.File[];
      coverLetter: Express.Multer.File[];
      letterOfRecommendation: Express.Multer.File[];
    },
  ) {
    const { bankStatement, coverLetter, letterOfRecommendation } = files;
    try {
      const { secure_url: bankStatementUrl } = await uploadFile(
        bankStatement[0].buffer,
        this.cloudinaryConfig,
      );
      const { secure_url: coverLetterUrl } = await uploadFile(
        coverLetter[0].buffer,
        this.cloudinaryConfig,
      );
      const { secure_url: letterOfRecommendationUrl } = await uploadFile(
        letterOfRecommendation[0].buffer,
        this.cloudinaryConfig,
      );
      await this.drizzle.insert(financialAidApplications).values({
        applicantId: await this.getStudentId(email),
        householdIncome: body.householdIncome,
        hasReceivedPreviousFinancialAid: body.hasReceivedPreviousFinancialAid
          ? 1
          : 0,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
        bankStatementUrl,
        coverLetterUrl,
        letterOfRecommendationUrl,
      });
      return {
        success: true,
        message: "Financial aid application created",
      };
    } catch (error) {
      this.logger.error(`Error creating financial aid application: ${error}`);
      return {
        success: false,
        message: "Error creating financial aid application",
      };
    }
  }
}
