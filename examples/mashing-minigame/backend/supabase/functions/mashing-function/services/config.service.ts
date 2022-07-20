import Database, { DatabaseService } from "../supabaseClient.ts";
import { AutoInjectable } from "https://deno.land/x/alosaur@v0.33.0/mod.ts";

export type MashingConfig = {
  orgUserCounterTypeId?: string
  endTime?: Date
};

export interface Config {
  orgId: string;
  config: MashingConfig
}

@AutoInjectable()
export class ConfigService {
  private db: DatabaseService
  constructor() {
    this.db = Database
  }

  async getConfig(orgId: string): Promise<Config | undefined> {
    const { data, error } = await this.db.client.from<Config>('config').select().filter('orgId', 'eq', orgId);

    return data?.[0];
  }

  async upsertConfig(orgId: string, config: MashingConfig): Promise<Config | undefined> {
    const { data, error } = await this.db.client.from<Config>('config').upsert({ orgId, config })

    console.log(data, error)
    return data?.[0]
  }
}