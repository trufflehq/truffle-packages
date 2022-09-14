import { InternalServerError } from "alosaur/mod.ts";
import Database, { DatabaseRepository } from "./database.repository.ts";
import { SubmissionRecord, SubmissionStatus, SubmissionUpsertInput } from "../types/mod.ts";

const FULL_ROW_SELECT =
  `id, orgId, userId, username, userProfileUrl, channelTitle, connectionType, connectionId, title, link, status, timestamp, songDurationMs`;

// TODO put this in a more general place
export enum OrderEnum {
  ASC = "asc",
  DESC = "desc",
}
export class SubmissionRepository {
  private db: DatabaseRepository;

  constructor() {
    this.db = Database;
  }

  async getById(id: string) {
    const { data, error } = await this.db.client.from<SubmissionRecord>("submissions").select(
      FULL_ROW_SELECT,
    )
      .eq("id", id);

    if (error) {
      console.error("error upserting submission", error);
      throw new InternalServerError("getById::Error updating submission");
    }
    return data?.[0];
  }

  async getByOrgIdAndLink(orgId: string, link: string) {
    const { data, error } = await this.db.client.from<SubmissionRecord>("submissions").select(
      FULL_ROW_SELECT,
    )
      .eq("orgId", orgId)
      .eq('link', link);

    if (error) {
      console.error("Error getting submission", error);
      throw new InternalServerError("getByOrgIdAndLink::Error getting submission");
    }
    return data?.[0];
  }

  async getByOrgIdAndUserId(orgId: string, userId: string) {
    const { data, error } = await this.db.client.from<SubmissionRecord>("submissions").select(
      FULL_ROW_SELECT,
    )
      .eq("orgId", orgId)
      .eq('userId', userId);

    if (error) {
      console.error("Error getting submission", error);
      throw new InternalServerError("getByOrgIdAndUserId::Error getting submission");
    }
    return data?.[0];
  }  

  async clearAllSubmissionsByOrgId(orgId: string) {
    const { data, error } = await this.db.client.from<SubmissionRecord>("submissions").delete({ returning: "representation" })
    .eq("orgId", orgId);

    if (error) {
      console.error("error clearing org submissions", error);
      throw new InternalServerError("clearAllSubmissionsByOrgId::Error clearing submissions");
    }
    
    return data?.[0];
  }

  async deleteById(id: string) {
    const { data, error } = await this.db.client.from<SubmissionRecord>("submissions").delete({ returning: "representation" })
      .eq("id", id);

    if (error) {
      console.error("error deleting submission", error);
      throw new InternalServerError("deleteById::Error deleting submission");
    }
    return data?.[0];
  }

  async upsertByRow(existingRow: SubmissionRecord, diff: Partial<SubmissionRecord>) {
    if (!existingRow) {
      throw new InternalServerError("upsertByRow::row doesnt exist");
    }

    const rowDiff: SubmissionRecord = {
      ...existingRow,
      ...diff,
    };

    const { data, error } = await this.db.client.from<SubmissionRecord>("submissions").upsert(rowDiff);

    if (error) {
      console.error("error upserting submission", error);
      throw new InternalServerError("upsertByRow::Error upserting submission");
    }
    return data?.[0];
  }

  async upsert(diff: SubmissionUpsertInput) {
    const diffWithTimestamp: SubmissionRecord = {
      ...diff,
      id: crypto.randomUUID(),
      timestamp: this.getTimestamp(),
    };

    const { data, error } = await this.db.client.from<SubmissionRecord>("submissions").upsert(diffWithTimestamp);

    if (error) {
      console.error("error upserting submission", error);
      throw new InternalServerError("upsert::Error updating submission");
    }
    return data?.[0];
  }

  async getSubmissionUserIdsByOrgId(orgId: string) {
    const { data, error } = await this.db.client.from<{ userId: string, orgId: string }>("submissions").select(
      'userId, orgId',
    )
      .eq("orgId", orgId)

    if (error) {
      console.error("error upserting submission", error);
      throw new InternalServerError("Error updating submission");
    }

    // const userIds = new Set(data.map(({ userId }) => userId))
    const userIds = data.map(({ userId }) => userId)


    return userIds;
  }

  async get(
    { orgId, status = "review", limit = 50, order = OrderEnum.DESC }: {
      orgId: string;
      status?: SubmissionStatus;
      limit?: number;
      order?: OrderEnum;
    },
  ) {
    const { data, error } = await this.db.client.from<SubmissionRecord>("submissions").select(
      FULL_ROW_SELECT
    )
      .eq("orgId", orgId)
      .eq("status", status)
      .order("timestamp", { ascending: order === OrderEnum.ASC ? true : false })
      .limit(limit);

    if (error) {
      console.error("error upserting submission", error);
      throw new InternalServerError("Error updating submission");
    }

    return data;
  }

  getPagination = (page: number, size: number) => {
    const limit = size ? +size : 3
    const from = page ? page * limit : 0
    const to = page ? from + size - 1 : size - 1
  
    return { from, to }
  }

  async getSubmissionPage(
    { orgId, status = "review", size = 20, page = 0 }: {
      orgId: string;
      page: number;
      size?: number;
      status?: SubmissionStatus;
    },
  ) {
    const { from, to } = this.getPagination(page, size)

    const { data, count, error } = await this.db.client.from<SubmissionRecord>("submissions").select(
      "*", { count: 'exact'}
    )
      .eq("orgId", orgId)
      .eq("status", status)
      .order("timestamp", { ascending: true })
      .range(from, to)

    if (error) {
      console.error("getSubmissionPage::Error getting submission page", error);
      return { data: [], count: 0 };

      // throw new InternalServerError("getSubmissionPage::Error getting submission page");
    }

    return { data, count };
  }

  async getRandomSubmission({ orgId, status = "approved" }: { orgId: string; status?: SubmissionStatus }) {
    const submissions = await this.get({ orgId, status, limit: 500, order: OrderEnum.DESC });

    return submissions[Math.floor(Math.random() * submissions.length)];
  }

  async getSubmissionCountByOrgId(orgId: string) {
    const { count, error } = await this.db.client.from<SubmissionRecord>("submissions").select(
      "*", { count: 'exact'}
    )
      .eq("orgId", orgId)

      if (error) {
        console.error("getOrgTotalSubmissionCount::Error getting submission count", error);
        return 0
        // throw new InternalServerError("getOrgTotalSubmissionCount::Error getting submission count");
      }

    return count || 0
  }

  getTimestamp() {
    return new Date(Date.now());
  }
}
