import { NotFoundError, Content } from "alosaur/mod.ts";
import { OrgUserCounterRepository } from "../repositories/org-user-counter.repository.ts";
import { OrgUserCounterTypeRepository } from "../repositories/org-user-counter-type.repository.ts";

export class RefundService {
  private orgUserCounterRepository: OrgUserCounterRepository;
  private orgUserCounterTypeRepository: OrgUserCounterTypeRepository;
  constructor() {
    this.orgUserCounterRepository = new OrgUserCounterRepository();
    this.orgUserCounterTypeRepository = new OrgUserCounterTypeRepository();
  }

  // TODO make this a set after load testing
  // async refundChannelPoints(orgId: string, userIds: Set<string>) {
  async refundChannelPoints(orgId: string, userIds: string[]) {
    // get channel point ouct
    const channelPointsOrgUserCounterType = await this.orgUserCounterTypeRepository.getOrgUserCounterType(orgId, 'channel-points')

    console.log('channelPointsOrgUserCounterType', channelPointsOrgUserCounterType)

    if(!channelPointsOrgUserCounterType?.id) {
      throw new NotFoundError("Missing channel points orgUserCounterType");
    }

    // call batch increment
    // FIXME - this should pull the actual collectible price
    const batchIncrementResult = await this.orgUserCounterRepository.batchIncrementOUCs(channelPointsOrgUserCounterType?.id, [...Array.from(userIds)], 5, orgId)

    console.log('batchIncrementResult', batchIncrementResult)

    return Content(true, 204)
  }
}