import {  Body, Controller, ForbiddenError, Post } from "alosaur/mod.ts";
import {  PollEndActionModelDTO, PollStartActionModelDTO } from "../models/mod.ts";
import { hasPermission, validateDTO } from "../utils/mod.ts";
import { PollService } from '../services/poll.service.ts'

@Controller('/poll')
export class PollController {
  private pollService: PollService;

  constructor() {
    this.pollService = new PollService();
  }
  // TODO - switch this over to DI once Deno Deploy supports emitDecoratorMetadata
  // constructor(private submissionService: SubmissionService) {}

  @Post("/start")
  async start(@Body(PollStartActionModelDTO) dto: PollStartActionModelDTO) {
    console.log("/poll/start", dto);
    await validateDTO(dto);
    const hasUpdatePermission = hasPermission(dto.data?.orgUser, ["admin", "moderator", "mod"]);

    if (!hasUpdatePermission) {
      throw new ForbiddenError("Insufficient permissions");
    }
    console.log("starting poll");

    return this.pollService.start(dto?.data?.orgId, dto.data?.submissionId)
  }

  @Post("/end")
  async end(@Body(PollEndActionModelDTO) dto: PollEndActionModelDTO) {
    console.log("/poll/end", dto);
    await validateDTO(dto);
    const hasUpdatePermission = hasPermission(dto.data?.orgUser, ["admin", "moderator", "mod"]);

    if (!hasUpdatePermission) {
      throw new ForbiddenError("Insufficient permissions");
    }

    console.log('ending poll', dto.data?.pollId)
    
    return this.pollService.endPoll(dto.data?.orgId, dto.data?.pollId);
  }
}
