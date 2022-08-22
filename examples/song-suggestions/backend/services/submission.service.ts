import { BadRequestError, Content } from "alosaur/mod.ts";
import { SubmissionRepository, OrderEnum } from "../repositories/submission.repository.ts";
import { RefundService } from './refund.service.ts'
import { SubmissionStatus } from "../types/mod.ts";

export class SubmissionService {
  private submissionRepository: SubmissionRepository;
  private refundService: RefundService;

  constructor() {
    this.submissionRepository = new SubmissionRepository();
    this.refundService = new RefundService()
  }

  getRandomSubmission(orgId: string, status?: SubmissionStatus) {
    return this.submissionRepository.getRandomSubmission({orgId, status })
  }

  async getMeSubmission(orgId: string, userId: string) {
    const submission = await this.submissionRepository.getByOrgIdAndUserId(orgId, userId)

    return Content(submission, 200)
  }


  async getSubmissions(orgId: string, status?: SubmissionStatus, limit?: number, order?: OrderEnum) {
    const submissions = await this.submissionRepository.get({ orgId, status, limit, order })

    return Content(submissions, 200)
  }

  async getSubmissionCount(orgId: string) {
    const count = await this.submissionRepository.getSubmissionCountByOrgId(orgId)
    if(!count) throw new BadRequestError("Missing count")

    return Content(count, 200)
  }

  async getSubmissionPage(orgId: string, page: number, size?: number, status?: SubmissionStatus) {
    const { data, count } = await this.submissionRepository.getSubmissionPage({ orgId, page, size, status })

    return Content({ submissions: data, count }, 200)
  }

  async clearOrgSubmissions(orgId?: string) {
    if (!orgId) throw new BadRequestError("missing orgId");

    // get all of the submission user ids
    const userIds = await this.submissionRepository.getSubmissionUserIdsByOrgId(orgId);


    await this.submissionRepository.clearAllSubmissionsByOrgId(orgId)

    console.log('userIds', userIds)

    await this.refundService.refundChannelPoints(orgId, userIds);

    return Content('Cleared', 200);
  }

  async updateSubmissionStatus(submissionId: string | undefined, status: SubmissionStatus | undefined) {
    if (!submissionId) throw new BadRequestError("missing submission id");
    if (!status) throw new BadRequestError("missing status");

    const existingRow = await this.submissionRepository.getById(submissionId);

    const updateSubmission = await this.submissionRepository.upsertByRow(existingRow, { status });

    return Content(updateSubmission, 200);
  }

  async deleteSubmission(submissionId: string | undefined) {
    if (!submissionId) throw new BadRequestError("missing submission id");

    const deletedRow = await this.submissionRepository.deleteById(submissionId);

    return Content(deletedRow, 200);
  }
}
