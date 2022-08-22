import { TruffleRepository } from "./truffle.repository.ts";
import { OrgUserCounterBatchIncrementPayload } from "../types/mod.ts";

export class OrgUserCounterRepository {
  private truffleRepository: TruffleRepository;

  constructor() {
    this.truffleRepository = new TruffleRepository();
  }

  async batchIncrementOUCs(
    orgUserCounterTypeId: string,
    userIds: string[],
    count: number,
    orgId: string
  ) {
    const query = `mutation OrgUserCounterIncrementQuery ($input: OrgUserCounterBatchIncrementInput) {
      orgUserCounterBatchIncrement(input: $input) {
         isBatchUpdated
      }
  }`;

    const variables = {
      input: {
        userIds,
        orgUserCounterTypeId,
        count
      },
    };

    try {
      const response = await this.truffleRepository.fetch(query, variables, orgId);
      const data: OrgUserCounterBatchIncrementPayload = await response.json();

      return data.data.orgUserCounterBatchIncrement.isBatchUpdated;
    } catch (err) {
      console.error("error during truffle fetch", err.message);
    }
  }
}
