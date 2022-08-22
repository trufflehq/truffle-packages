import { TruffleRepository } from "./truffle.repository.ts";
import { PollUpsertPayload, PollUserInputOption, PollData } from "../types/mod.ts";

const POLL_DURATION_SECONDS = 60;

export class PollRepository {
  private truffleRepository: TruffleRepository;

  constructor() {
    this.truffleRepository = new TruffleRepository();
  }

  async createPoll(
    question: string,
    options: PollUserInputOption[],
    orgId?: string,
    data?: PollData,
    durationSeconds = POLL_DURATION_SECONDS,
  ) {
    const query = `mutation PollUpsert ($input: PollUpsertInput) {
      pollUpsert(input: $input) {
          poll {
              id
              question
              options {
                text
                index
              }
          }
      }
    }`;

    const variables = {
      input: {
        question,
        options,
        durationSeconds,
        data
      },
    };

    try {
      const response = await this.truffleRepository.fetch(query, variables, orgId);
      const data: PollUpsertPayload = await response.json();

      return data.data.pollUpsert.poll;
    } catch (err) {
      console.error("error during truffle fetch", err.message);
    }
  }

  async endPoll(orgId: string, pollId: string) {
    const query = `mutation PollUpsert ($input: PollUpsertInput) {
      pollUpsert(input: $input) {
          poll {
              id
              question
              options {
                text
                index
              }
              endTime
          }
      }
    }`;

    const variables = {
      input: {
        id: pollId,
        durationSeconds: 1,
      },
    };

    try {
      const response = await this.truffleRepository.fetch(query, variables, orgId);
      const data: PollUpsertPayload = await response.json();

      console.log('poll end data', data)
      return data.data.pollUpsert.poll;
    } catch (err) {
      console.error("error during truffle fetch", err.message);
    }
  }
}
