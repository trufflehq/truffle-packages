import { BadRequestError } from "alosaur/mod.ts";
import { MashingConfigModelDTO } from "../models/mod.ts";
import { ConfigRepository } from "../repositories/config.repository.ts";

export class AdminService {
  private configRepository: ConfigRepository;

  constructor() {
    this.configRepository = new ConfigRepository();
  }

  async startRound(dto: MashingConfigModelDTO) {
    const orgId = dto.data?.orgId;
    const config = {
      orgUserCounterTypeId: dto.data?.orgUserCounterTypeId,
      endTime: dto.data?.endTime,
    };

    if (orgId && config) {
      const upsertedConfig = await this.configRepository.upsertConfigByOrgId(
        orgId,
        config,
      );

      return {
        data: upsertedConfig,
      };
    } else {
      throw new BadRequestError("Missing config options");
    }
  }
}
