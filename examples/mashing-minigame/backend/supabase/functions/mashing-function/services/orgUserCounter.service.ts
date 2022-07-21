import { TruffleService } from "./truffle.service.ts";

export class OrgUserCounterService {
  private truffleService: TruffleService;

  constructor() {
    this.truffleService = new TruffleService();
  }

  async increment(orgId: string, orgUserCounterTypeId: string, userId: string) {
    const query = `
      mutation OrgUserCounterIncrementQuery ($input: OrgUserCounterIncrementInput) {
        orgUserCounterIncrement(input: $input) {
          isUpdated
        }
    }`;

    const input = {
      input: {
        orgUserCounterTypeId,
        userId,
        count: 1,
      },
    };

    const response = await this.truffleService.fetch(query, input, orgId);

    const data = await response.json();

    return data;
  }
}
