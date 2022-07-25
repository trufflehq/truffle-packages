import { TruffleRepository } from "./truffle.repository.ts";

export class OrgUserCounterRepository {
  private truffleRepository: TruffleRepository;

  constructor() {
    this.truffleRepository = new TruffleRepository();
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

    const response = await this.truffleRepository.fetch(query, input, orgId);

    const data = await response.json();

    return data;
  }
}
