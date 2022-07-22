import { Body, Controller, ForbiddenError, Post } from "alosaur/mod.ts";
import { MashingConfigModelDTO } from "../models/mod.ts";
import { AdminService } from "../services/admin.service.ts";
import { hasPermission, validateDTO } from "../utils/mod.ts";

@Controller("/admin")
export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }
  // TODO - switch this over to DI once this is working w/ Supabase or Deno Deploy
  // constructor(private configService: ConfigService) {}

  @Post("/start")
  async start(@Body(MashingConfigModelDTO) dto: MashingConfigModelDTO) {
    await validateDTO(dto);
    const hasUpdatePermission = hasPermission(dto.data?.orgUser, "admin");

    if (!hasUpdatePermission) {
      throw new ForbiddenError("Insufficient permissions");
    }

    return this.adminService.startRound(dto);
  }
}
