import { Inject, Injectable } from "@nestjs/common";
import { DRIZZLE, Database } from "src/db";
import { eq } from "drizzle-orm";
import { financialAidApplications } from "src/db/financial-aid-applications";
import { ApproveFinancialAidApplicationDto } from "./dto/approve-financial-aid-application.dto";
import { FinancialAidTypesService } from "src/financial-aid-types/financial-aid-types.service";
import { MailService } from "src/mail/mail.service";
import { data } from "src/shared/interfaces";
import { generateNewFinancialAidApplicationVerdictEmail } from "src/shared/helpers/email-generators";

@Injectable()
export class FinancialAidApplicationsService {
  constructor(
    @Inject(DRIZZLE)
    private readonly drizzle: Database,
    private readonly financialAidTypesService: FinancialAidTypesService,
    private readonly mailService: MailService,
  ) {}

  async findAll() {
    try {
      const financialAidApplications =
        await this.drizzle.query.financialAidApplications.findMany({
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
            applicant: {
              columns: {
                firstName: true,
                lastName: true,
              },
              with: {
                user: {
                  columns: {
                    email: true,
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
        });
      return {
        success: true,
        message: "Financial aid applications found",
        data: financialAidApplications.map(financialAidApplication => ({
          id: financialAidApplication.id,
          applicantName:
            financialAidApplication.applicant.firstName +
            " " +
            financialAidApplication.applicant.lastName,
          applicant: {
            firstName: financialAidApplication.applicant.firstName,
            lastName: financialAidApplication.applicant.lastName,
            email: financialAidApplication.applicant.user.email,
          },
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
    } catch (error) {
      return {
        success: false,
        message: "Error finding financial aid applications",
      };
    }
  }

  async findOne(id: number) {
    try {
      const financialAidApplication =
        await this.drizzle.query.financialAidApplications.findFirst({
          where: eq(financialAidApplications.id, id),
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
            applicant: {
              columns: {
                firstName: true,
                lastName: true,
              },
              with: {
                user: {
                  columns: {
                    email: true,
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
        });
      if (financialAidApplication) {
        return {
          success: true,
          message: "Financial aid application found",
          data: {
            id: financialAidApplication.id,
            applicantName:
              financialAidApplication.applicant.firstName +
              " " +
              financialAidApplication.applicant.lastName,
            applicant: {
              firstName: financialAidApplication.applicant.firstName,
              lastName: financialAidApplication.applicant.lastName,
              email: financialAidApplication.applicant.user.email,
            },
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
          },
        };
      } else {
        return {
          success: false,
          message: "Financial aid application not found",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Error finding financial aid application",
      };
    }
  }

  async approve(
    id: number,
    approveFinancialAidApplicationDto: ApproveFinancialAidApplicationDto,
  ) {
    try {
      const existingFinancialAidApplication = data(await this.findOne(id));
      const type = await this.financialAidTypesService.findOne(
        approveFinancialAidApplicationDto.typeId,
      );
      if (existingFinancialAidApplication && type) {
        await this.drizzle
          .update(financialAidApplications)
          .set({
            status: "approved",
            typeId: BigInt(approveFinancialAidApplicationDto.typeId),
            startDate: new Date(approveFinancialAidApplicationDto.startDate),
            endDate: new Date(approveFinancialAidApplicationDto.endDate),
            updatedAt: new Date(),
          })
          .where(eq(financialAidApplications.id, id));
        await this.mailService.sendMail({
          to: existingFinancialAidApplication.applicant.email,
          subject: "Financial aid application approved",
          html: generateNewFinancialAidApplicationVerdictEmail(
            existingFinancialAidApplication.applicant.firstName,
            "approved",
          ),
        });
        return {
          success: true,
          message: "Financial aid application approved",
        };
      } else {
        return {
          success: false,
          message: "Error approving financial aid application",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Error approving financial aid application",
      };
    }
  }

  async reject(id: number) {
    try {
      const existingFinancialAidApplication = data(await this.findOne(id));
      if (existingFinancialAidApplication) {
        await this.drizzle
          .update(financialAidApplications)
          .set({
            status: "rejected",
            updatedAt: new Date(),
          })
          .where(eq(financialAidApplications.id, id));
        await this.mailService.sendMail({
          to: existingFinancialAidApplication.applicant.email,
          subject: "Financial aid application rejected",
          html: generateNewFinancialAidApplicationVerdictEmail(
            existingFinancialAidApplication.applicant.firstName,
            "rejected",
          ),
        });
        return {
          success: true,
          message: "Financial aid application rejected",
        };
      } else {
        return {
          success: false,
          message: "Error rejecting financial aid application",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Error rejecting financial aid application",
      };
    }
  }

  async remove(id: number) {
    try {
      const existingFinancialAidApplication = await this.findOne(id);
      if (existingFinancialAidApplication) {
        await this.drizzle
          .delete(financialAidApplications)
          .where(eq(financialAidApplications.id, id));
        return {
          success: true,
          message: "Financial aid application removed",
        };
      } else {
        return {
          success: false,
          message: "Financial aid application not found",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Error removing financial aid application",
      };
    }
  }
}
