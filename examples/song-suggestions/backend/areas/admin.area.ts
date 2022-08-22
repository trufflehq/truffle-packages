import { Area } from "alosaur/mod.ts";
import { SubmissionController } from '../controllers/submission.controller.ts'
import { PollController } from '../controllers/poll.controller.ts'

@Area({
  baseRoute: "/admin",
  controllers: [SubmissionController, PollController],
})
export class AdminArea {}
