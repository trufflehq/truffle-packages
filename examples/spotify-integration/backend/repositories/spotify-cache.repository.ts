import { InternalServerError } from "alosaur/mod.ts";
import Database, { DatabaseRepository } from "./database.repository.ts";
import { SpotifyCacheRecord, SpotifyCacheType, SpotifyCacheData } from './types.ts'

export class SpotifyCacheRepository {
  private db: DatabaseRepository;

  constructor() {
    this.db = Database;
  }

  async getCacheByOrgIdAndType(orgId: string, cacheType: SpotifyCacheType) {
    const { data, error } = await this.db.client.from<SpotifyCacheRecord>("cache").select("orgId, type, ttl, data")
      .eq("orgId", orgId)
      .eq("type", cacheType)

    if (error) {
      throw new InternalServerError(error.message);
    }

    const cachedData = data?.[0];

    return this.defaultOutput(cachedData)
  }

  async upsert(orgId: string, type: SpotifyCacheType, cacheData: SpotifyCacheData, ttl?: number) {
    const diff: SpotifyCacheRecord = {
      orgId,
      type,
      ttl: this.getTimestamp(ttl),
      data: cacheData
    };

    const { data, error } = await this.db.client.from<SpotifyCacheRecord>("cache").upsert(diff);

    if (error) {
      console.error("error upserting to cache", error);
      throw new InternalServerError("Error updating cache");
    }
    return data?.[0];
  }

  defaultOutput(cachedData: SpotifyCacheRecord) {
    return {
      ...cachedData,
      isExpired: this.isTimestampExpired(cachedData?.ttl)
    }
  }

  getTimestamp(ttl = 10) {
    return new Date(Date.now() + 1000 * ttl);
  }

  isTimestampExpired(timeStamp?: Date) {
    if(!timeStamp) return true

    const start = new Date().getTime();
    const end = new Date(timeStamp).getTime();
    const timeRemaining = (end - start) / 1000;

    console.log("timeRemaining", timeRemaining);

    return timeRemaining < 0;
  }
}
