import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { FinancialAidApplicationsService } from "./financial-aid-applications.service";
import { ApproveFinancialAidApplicationDto } from "./dto/approve-financial-aid-application.dto";
import { RBACGuard } from "src/auth/rbac.guard";
import { UserRoles } from "src/shared/constants";
import { AdminPermissions } from "src/shared/constants/admin-permissions";
import { Permissions, Roles } from "src/shared/decorators";

@Controller("financial-aid-applications")
export class FinancialAidApplicationsController {
  constructor(
    private readonly financialAidApplicationsService: FinancialAidApplicationsService,
  ) {}

  @Get()
  @UseGuards(RBACGuard)
  @Roles(UserRoles.ADMIN)
  @Permissions(AdminPermissions.FINANCIAL_AID_MANAGEMENT)
  findAll() {
    return this.financialAidApplicationsService.findAll();
  }

  @Get(":id")
  @UseGuards(RBACGuard)
  @Roles(UserRoles.ADMIN, UserRoles.STUDENT)
  @Permissions(AdminPermissions.FINANCIAL_AID_MANAGEMENT)
  findOne(@Param("id") id: string) {
    return this.financialAidApplicationsService.findOne(+id);
  }

  @Patch("/:status/:id")
  @UseGuards(RBACGuard)
  @Roles(UserRoles.ADMIN)
  @Permissions(AdminPermissions.FINANCIAL_AID_MANAGEMENT)
  updateStatus(
    @Param("id") id: string,
    @Param("status") status: "approve" | "reject",
    @Body()
    approveFinancialAidApplicationDto: ApproveFinancialAidApplicationDto,
  ) {
    if (status === "approve") {
      return this.financialAidApplicationsService.approve(
        +id,
        approveFinancialAidApplicationDto,
      );
    } else if (status === "reject") {
      return this.financialAidApplicationsService.reject(+id);
    } else {
      return {
        success: false,
        message: "Invalid status",
      };
    }
  }

  @Delete(":id")
  @UseGuards(RBACGuard)
  @Roles(UserRoles.ADMIN, UserRoles.STUDENT)
  @Permissions(AdminPermissions.FINANCIAL_AID_MANAGEMENT)
  remove(@Param("id") id: string) {
    return this.financialAidApplicationsService.remove(+id);
  }
}
