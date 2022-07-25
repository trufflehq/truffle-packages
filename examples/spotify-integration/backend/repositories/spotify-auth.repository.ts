import { InternalServerError } from "alosaur/mod.ts";
import Database, { DatabaseRepository } from "./database.repository.ts";
import { SpotifyAuthRecord, SpotifyAuthToken } from "./types.ts";

export class SpotifyAuthRepository {
  private db: DatabaseRepository;

  constructor() {
    this.db = Database;
  }

  async getAuthByOrgId(orgId: string) {
    const { data, error } = await this.db.client.from<SpotifyAuthRecord>("auth")
      .select("orgId, access_token, refresh_token, expirationTime")
      .filter("orgId", "eq", orgId);

    console.log("data", data);

    if (error) {
      throw new InternalServerError(error.message);
    }

    const auth = data?.[0];

    return auth;
  }

  async upsertAuth(orgId: string, authToken: SpotifyAuthToken) {
    const expirationTime = this.dateTimeUntil(authToken.expires_in);

    const diff: SpotifyAuthRecord = {
      orgId,
      access_token: authToken.access_token,
      refresh_token: authToken.refresh_token,
      expirationTime: expirationTime,
      data: authToken,
    };

    const { data, error } = await this.db.client.from<SpotifyAuthRecord>("auth")
      .upsert(diff);

    if (error) {
      console.error("error upserting config", error);
      throw new InternalServerError("Error updating auth token");
    }
    return data?.[0];
  }

  dateTimeUntil(seconds: number) {
    return new Date(Date.now() + 1000 * seconds);
  }

  isTimestampExpired(timeStamp: Date) {
    const start = new Date().getTime();
    const end = new Date(timeStamp).getTime();
    const timeRemaining = (end - start) / 1000;

    console.log("timeRemaining", timeRemaining);

    return timeRemaining < 0;
  }
}
