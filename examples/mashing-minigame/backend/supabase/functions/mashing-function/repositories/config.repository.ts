import Database, { DatabaseService } from "../services/database.ts";

export type MashingConfig = {
  orgUserCounterTypeId?: string;
  endTime?: Date;
};

export interface Config {
  orgId: string;
  config: MashingConfig;
}

export class ConfigRepository {
  private db: DatabaseService;
  constructor() {
    this.db = Database;
  }

  async getConfigByOrgId(orgId: string) {
    const { data, error } = await this.db.client.from<Config>("config").select().filter("orgId", "eq", orgId);

    if (error) {
      console.error("error getting config", error);
    }
    return data?.[0];
  }

  async upsertConfigByOrgId(orgId: string, config: MashingConfig) {
    const { data, error } = await this.db.client.from<Config>("config").upsert({ orgId, config });

    if (error) {
      console.error("error upserting config", error);
    }
    return data?.[0];
  }
}
