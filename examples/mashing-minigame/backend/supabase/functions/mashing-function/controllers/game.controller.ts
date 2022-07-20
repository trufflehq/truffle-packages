import { BadRequestError, Body, Controller, Post } from "https://deno.land/x/alosaur@v0.33.0/mod.ts";
import { validateDTO } from "../utils/validation.ts";
import { IncrementModelDTO } from "../models/mod.ts";
import { ConfigService } from "../services/config.service.ts";
import { OrgUserCounterService } from "../services/orgUserCounter.service.ts";

export function getMashTimeRemaining(pollEndTime: Date) {
  const start = new Date().getTime();
  const end = new Date(pollEndTime).getTime();
  const timeRemaining = (end - start) / 1000;

  console.log("timeRemaining", timeRemaining);

  return timeRemaining ?? 0;
}

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
    console.log("incrementing user", dto.data?.orgUser?.roleConnection);
    await validateDTO(dto);

    const orgId = dto.data?.orgId;
    const userId = dto.data?.userId;
    // get the mashing config
    if (orgId && userId) {
      const orgConfig = await this.configService.getConfig(orgId);
      const orgUserCounterTypeId = orgConfig?.config.orgUserCounterTypeId;
      console.log("orgConfig", orgConfig);

      const isActiveRound = orgConfig?.config?.endTime && getMashTimeRemaining(orgConfig.config.endTime) > 0;
      if (isActiveRound && orgUserCounterTypeId) {
        console.log("increment the thing");

        const increment = await this.orgUserCounterService.increment(orgConfig.orgId, orgUserCounterTypeId, userId);

        console.log("increment", increment);
      } else {
        throw new BadRequestError("Round expired");
      }
    }

    // call

    return {
      data: `${JSON.stringify(dto)}`,
    };
  }
}
