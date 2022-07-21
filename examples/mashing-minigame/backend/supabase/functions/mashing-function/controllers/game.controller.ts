import { BadRequestError, Body, Controller, ForbiddenError, Post } from "alosaur/mod.ts";
import { IncrementModelDTO } from "../models/mod.ts";
import { ConfigService } from "../services/config.service.ts";
import { OrgUserCounterService } from "../services/orgUserCounter.service.ts";
import { getMashTimeRemaining, hasPermission, validateDTO } from "../utils/mod.ts";

@Controller("/game")
export class GameController {
  private configService: ConfigService;
  private orgUserCounterService: OrgUserCounterService;
  constructor() {
    this.configService = new ConfigService();
    this.orgUserCounterService = new OrgUserCounterService();
  }

  @Post("/increment")
  async start(@Body(IncrementModelDTO) dto: IncrementModelDTO) {
    await validateDTO(dto);
    const canIncrement = hasPermission(dto.data?.orgUser, "everyone");

    if (!canIncrement) {
      throw new ForbiddenError("Insufficient permissions");
    }

    const orgId = dto.data?.orgId;
    const userId = dto.data?.userId;

    if (orgId && userId) {
      const orgConfig = await this.configService.getConfig(orgId);
      const orgUserCounterTypeId = orgConfig?.config.orgUserCounterTypeId;

      const isActiveRound = orgConfig?.config?.endTime && getMashTimeRemaining(orgConfig.config.endTime) > 0;
      if (isActiveRound && orgUserCounterTypeId) {
        try {
          await this.orgUserCounterService.increment(orgConfig.orgId, orgUserCounterTypeId, userId);
        } catch (err) {
          console.error("error incrementing", err.message);
        }
      } else {
        throw new BadRequestError("Round expired");
      }
    }

    return {
      data: `${JSON.stringify(dto)}`,
    };
  }
}
