import { BadRequestError } from "alosaur/mod.ts";
import { IncrementModelDTO } from "../models/mod.ts";
import { ConfigRepository } from "../repositories/config.repository.ts";
import { OrgUserCounterRepository } from "../repositories/orgUserCounter.repository.ts";
import { getMashTimeRemaining } from "../utils/mod.ts";

export class GameService {
  private configRepository: ConfigRepository;
  private orgUserCounterRepository: OrgUserCounterRepository;

  constructor() {
    this.configRepository = new ConfigRepository();
    this.orgUserCounterRepository = new OrgUserCounterRepository();
  }

  async increment(dto: IncrementModelDTO) {
    const orgId = dto.data?.orgId;
    const userId = dto.data?.userId;

    if (orgId && userId) {
      const orgConfig = await this.configRepository.getConfigByOrgId(orgId);
      const orgUserCounterTypeId = orgConfig?.config.orgUserCounterTypeId;

      const isActiveRound = orgConfig?.config?.endTime &&
        getMashTimeRemaining(orgConfig.config.endTime) > 0;
      if (isActiveRound && orgUserCounterTypeId) {
        try {
          await this.orgUserCounterRepository.increment(
            orgConfig.orgId,
            orgUserCounterTypeId,
            userId,
          );
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
