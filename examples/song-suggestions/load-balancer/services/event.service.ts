import { BadRequestError } from 'alosaur/mod.ts'
import { SubmissionEventModelDTO } from '../models/mod.ts'
import { LoadBalancerRepository } from '../repositories/load-balancer.repository.ts'
import { TRUFFLE_WEBHOOK_VERIFICATION_CHALLENGE, isTargetEventTopicByPath } from "https://tfl.dev/@truffle/events@0.0.1/index.ts"

const SUBMISSION_EVENT_TOPIC_SLUG = 'song-submission-topic'

export class EventService {
  
  constructor() {
    // TODO add load balancer repo
    this.loadBalancerRepository = new LoadBalancerRepository()
  }

  private loadBalancerRepository: LoadBalancerRepository

   handleSubmissionEvent(dto: SubmissionEventModelDTO) {
    if(dto.data?.eventTopicPath === TRUFFLE_WEBHOOK_VERIFICATION_CHALLENGE) {
      return new Response(dto.data.challenge, { status: 200 })
    }


    if(!isTargetEventTopicByPath(dto.data?.eventTopicPath!, SUBMISSION_EVENT_TOPIC_SLUG)) {
      throw new BadRequestError('Incorrect eventTopicPath')
    }

    return this.loadBalancerRepository.forwardSubmissionEvent(dto)
  }
}