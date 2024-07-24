import { Controller, Get, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { RBACGuard } from "src/auth/rbac.guard";
import { Permissions, Roles } from "src/shared/decorators";
import { UserRoles } from "src/shared/constants";
import { AdminPermissions } from "src/shared/constants/admin-permissions";

@Controller("admin")
@UseGuards(RBACGuard)
@Roles(UserRoles.ADMIN)
@Permissions(AdminPermissions.DASHBOARD_ACCESS)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("stats/dashboard")
  getMyDashboardStats() {
    return this.adminService.getDashboardStats();
  }
}
