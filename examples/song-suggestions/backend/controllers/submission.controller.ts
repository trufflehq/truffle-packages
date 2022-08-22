import { BadRequestError, Body, Controller, ForbiddenError, Get, Post, QueryParam } from "alosaur/mod.ts";
import { SubmissionDeleteActionModelDTO, SubmissionUpdateActionModelDTO, SubmissionsClearActionModelDTO } from "../models/mod.ts";
import { hasPermission, validateDTO } from "../utils/mod.ts";
import { SubmissionService } from "../services/submission.service.ts";
import { OrderEnum } from "../repositories/submission.repository.ts";
import { SubmissionStatus } from '../types/mod.ts'

@Controller()
export class SubmissionController {
  private submissionService: SubmissionService;

  constructor() {
    this.submissionService = new SubmissionService();
  }
  // TODO - switch this over to DI once Deno Deploy supports emitDecoratorMetadata
  // constructor(private submissionService: SubmissionService) {}

  @Get("/submissions")
  submissions(@QueryParam("orgId") orgId: string, @QueryParam("status") status?: SubmissionStatus, @QueryParam("limit") limit?: number, @QueryParam("order") order?: OrderEnum) {
    if (!orgId) {
      throw new BadRequestError("Missing orgId");
    }

    return this.submissionService.getSubmissions(orgId, status, limit, order);
  }

  @Get("/submissions/page")
  paginatedSubmission(@QueryParam("orgId") orgId: string, @QueryParam("page") page: string, @QueryParam("size") size?: string, @QueryParam("status") status?: SubmissionStatus) {
    if (!orgId) {
      throw new BadRequestError("Missing orgId");
    }

    let parsedPage = 0
    let parsedSize = 0
    if(page) {
      parsedPage = parseInt(page)
    }
    if(size) {
      parsedSize = parseInt(size)
    }

    return this.submissionService.getSubmissionPage(orgId, parsedPage, parsedSize, status);
  }

  @Get("/submissions/count")
  submissionCount(@QueryParam("orgId") orgId: string) {
    if (!orgId) {
      throw new BadRequestError("Missing orgId");
    }

    return this.submissionService.getSubmissionCount(orgId);
  }

  @Get("/submission/me")
  submissionMe(@QueryParam("orgId") orgId: string, @QueryParam("userId") userId: string) {
    if (!orgId) {
      throw new BadRequestError("Missing orgId");
    }
    if(!userId) {
      throw new BadRequestError("Missing userId");
    }

    return this.submissionService.getMeSubmission(orgId, userId);
  }

  @Post("/submissions/clear")
  async clear(@Body(SubmissionsClearActionModelDTO) dto: SubmissionsClearActionModelDTO) {
    console.log("/submissions/clear", dto);
    
    await validateDTO(dto);
    const hasClearPermission = hasPermission(dto.data?.orgUser, ["admin", "moderator", "mod"]);

    if (!hasClearPermission) {
      throw new ForbiddenError("Insufficient permissions");
    }

    return this.submissionService.clearOrgSubmissions(dto?.data?.orgId);
  }

  @Get("/submission/random")
  submissionRandom(@QueryParam("orgId") orgId: string, @QueryParam("status") status?: SubmissionStatus) {
    if (!orgId) {
      throw new BadRequestError("Missing orgId");
    }

    return this.submissionService.getRandomSubmission(orgId, status)
  }

  @Post("/submission/update")
  async update(@Body(SubmissionUpdateActionModelDTO) dto: SubmissionUpdateActionModelDTO) {
    console.log("/submission/update", dto);
    await validateDTO(dto);
    const hasUpdatePermission = hasPermission(dto.data?.orgUser, ["admin", "moderator", "mod"]);

    if (!hasUpdatePermission) {
      throw new ForbiddenError("Insufficient permissions");
    }
    console.log("update submission");

    return this.submissionService.updateSubmissionStatus(dto.data?.submissionId, dto.data?.status);
  }

  @Post("/submission/delete")
  async delete(@Body(SubmissionDeleteActionModelDTO) dto: SubmissionDeleteActionModelDTO) {
    console.log("/submission/delete", dto);
    await validateDTO(dto);
    const hasUpdatePermission = hasPermission(dto.data?.orgUser, ["admin", "moderator", "mod"]);

    if (!hasUpdatePermission) {
      throw new ForbiddenError("Insufficient permissions");
    }

    console.log("delete submission");

    return this.submissionService.deleteSubmission(dto.data?.submissionId);
  }
}
