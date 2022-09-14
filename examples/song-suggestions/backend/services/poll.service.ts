import { BadRequestError, InternalServerError, NotFoundError, Content } from "alosaur/mod.ts";
import { SubmissionRepository } from "../repositories/submission.repository.ts";
import { PollRepository } from '../repositories/poll.repository.ts'
import { PollUserInputOption } from "../types/mod.ts";

export class PollService {
  private submissionRepository: SubmissionRepository;
  private pollRepository: PollRepository;

  constructor() {
    this.submissionRepository = new SubmissionRepository();
    this.pollRepository = new PollRepository();
  }

  async start(orgId?: string, submissionId?: string) {
    if(!orgId) throw new BadRequestError('Missing orgId')
    if(!submissionId) throw new BadRequestError('Missing submissionId')

    const submission = await this.submissionRepository.getById(submissionId)

    console.log('submission', submission)

    if(!submission) throw new NotFoundError('Submission doesn\'t exist')

    const { question, pollOptions } = this.getBasePoll()

    // const songDurationSeconds = (submission.songDurationMs && !isNaN(submission.songDurationMs)) ? submission.songDurationMs / 1000 : undefined
    const songDurationSeconds = 3600 // one hour

    console.log('songDurationSeconds', songDurationSeconds)
    const createdPoll = await this.pollRepository.createPoll(question, pollOptions, orgId, { submission }, songDurationSeconds)

    if(!createdPoll) {
      throw new InternalServerError('Error creating poll')
    }

    const deletedSubmission = await this.submissionRepository.deleteById(submissionId)

    console.log('deleted submission', deletedSubmission)

    return Content(createdPoll, 200)
  }

  async endPoll(orgId?: string, pollId?: string) {
    if(!orgId) throw new BadRequestError('Missing orgId')
    if(!pollId) throw new BadRequestError('Missing pollId')

    const endedPoll = await this.pollRepository.endPoll(orgId, pollId)

    console.log('endedPoll', endedPoll)

    if(!endedPoll) {
      throw new InternalServerError('Error ending poll')
    }

    return Content(endedPoll, 200)
  }

  getBasePoll() {
    const question = 'Should we add to the playlist?'

    const pollOptions: PollUserInputOption[] = [
      {
        text: 'Yes',
        index: 0
      },
      {
        text: 'No',
        index: 1
      }
    ]

    console.log('pollOptions', pollOptions)

    return { question, pollOptions }
  }
}
