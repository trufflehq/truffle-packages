import { ConfigRepository, MashingConfig } from "../repositories/config.repository.ts";

export class ConfigService {
  private configRepository: ConfigRepository;
  constructor() {
    this.configRepository = new ConfigRepository();
  }

  getConfig(orgId: string) {
    return this.configRepository.getConfigByOrgId(orgId);
  }

  upsertConfig(orgId: string, config: MashingConfig) {
    return this.configRepository.upsertConfigByOrgId(orgId, config);
  }
}
