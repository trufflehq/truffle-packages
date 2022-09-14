import { TruffleRepository } from "./truffle.repository.ts";
import {  OrgUserCounterTypePayload } from "../types/mod.ts";

export class OrgUserCounterTypeRepository {
  private truffleRepository: TruffleRepository;

  constructor() {
    this.truffleRepository = new TruffleRepository();
  }

  async getOrgUserCounterType(
    orgId: string,
    slug: string
  ) {
    const query = `query OrgUserCounterTypeBySlug ($input: OrgUserCounterTypeInput) {
      orgUserCounterType(input: $input) {
         id
         slug
         name
         decimalPlaces
      }
  }`;

    const variables = {
      input: {
        slug
      },
    };

    try {
      const response = await this.truffleRepository.fetch(query, variables, orgId);
      const data:  OrgUserCounterTypePayload = await response.json();

      return data.data.orgUserCounterType;
    } catch (err) {
      console.error("error during truffle fetch", err.message);
    }
  }
}
