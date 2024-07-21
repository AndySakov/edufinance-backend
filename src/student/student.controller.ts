import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { StudentService } from "./student.service";
import { RBACGuard } from "src/auth/rbac.guard";
import { UserRoles } from "src/shared/constants";
import { AuthUser, Roles } from "src/shared/decorators";
import { AuthenticatedUser } from "src/shared/interfaces";
import { CustomLogger } from "src/shared/utils/custom-logger";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { CreateFinancialAidApplicationDto } from "./dto/create-financial-aid-application.dto";

@Controller("student")
@UseGuards(RBACGuard)
@Roles(UserRoles.STUDENT)
export class StudentController {
  private readonly logger = new CustomLogger(StudentController.name);
  constructor(private readonly studentService: StudentService) {}

  @Get("profile")
  getMyProfile(@AuthUser() user: AuthenticatedUser) {
    return this.studentService.getMyProfile(user.email);
  }

  @Get("applications")
  getMyApplications(@AuthUser() user: AuthenticatedUser) {
    return this.studentService.getMyApplications(user.email);
  }

  @Get("bills")
  getMyBills(@AuthUser() user: AuthenticatedUser) {
    return this.studentService.getMyBills(user.email);
  }

  @Get("payments")
  getMyPayments(@AuthUser() user: AuthenticatedUser) {
    return this.studentService.getMyPayments(user.email);
  }

  @Get("stats/bills")
  getMyBillStats(@AuthUser() user: AuthenticatedUser) {
    return this.studentService.getMyBillStats(user.email);
  }

  @Get("stats/payments")
  getMyPaymentStats(@AuthUser() user: AuthenticatedUser) {
    return this.studentService.getMyPaymentStats(user.email);
  }

  @Get("stats/dashboard")
  getMyDashboardStats(@AuthUser() user: AuthenticatedUser) {
    return this.studentService.getMyDashboardStats(user.email);
  }

  @Get("financial-aid/info")
  getMyFinancialAidInfo(@AuthUser() user: AuthenticatedUser) {
    return this.studentService.getMyFinancialAidInformation(user.email);
  }

  @Post("financial-aid/apply")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "bankStatement", maxCount: 1 },
      { name: "coverLetter", maxCount: 1 },
      { name: "letterOfRecommendation", maxCount: 1 },
    ]),
  )
  applyForFinancialAid(
    @UploadedFiles()
    files: {
      bankStatement: Express.Multer.File[];
      coverLetter: Express.Multer.File[];
      letterOfRecommendation: Express.Multer.File[];
    },
    @Body() body: CreateFinancialAidApplicationDto,
    @AuthUser() user: AuthenticatedUser,
  ) {
    if (body.hasReceivedPreviousFinancialAid && body.householdIncome) {
      return this.studentService.applyForFinancialAid(user.email, body, files);
    } else {
      throw new BadRequestException({
        success: false,
        message: "Invalid request",
      });
    }
  }
}
