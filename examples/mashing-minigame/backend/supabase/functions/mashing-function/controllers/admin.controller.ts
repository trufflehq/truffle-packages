import { BadRequestError, Body, Controller, ForbiddenError, Post } from "alosaur/mod.ts";
import { MashingConfigModelDTO } from "../models/mod.ts";
import { ConfigService } from "../services/config.service.ts";
import { hasPermission, validateDTO } from "../utils/mod.ts";

@Controller("/admin")
export class AdminController {
  private configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
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

    const orgId = dto.data?.orgId;
    const config = {
      orgUserCounterTypeId: dto.data?.orgUserCounterTypeId,
      endTime: dto.data?.endTime,
    };

    if (orgId && config) {
      const upsertedConfig = await this.configService.upsertConfig(orgId, config);

      return {
        data: upsertedConfig,
      };
    } else {
      throw new BadRequestError("Missing config options");
    }
  }
}
