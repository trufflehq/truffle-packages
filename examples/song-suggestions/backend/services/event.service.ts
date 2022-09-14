import { BadRequestError, Content } from 'alosaur/mod.ts'
import { SubmissionEventModelDTO } from '../models/mod.ts'
import { TRUFFLE_WEBHOOK_VERIFICATION_CHALLENGE, isTargetEventTopicByPath } from "https://tfl.dev/@truffle/events@0.0.1/index.ts"
import { ConnectionRepository } from '../repositories/connection.repository.ts'
import { SubmissionRepository } from '../repositories/submission.repository.ts'
import { InnertubeRepository } from '../repositories/innertube.repository.ts'

const SUBMISSION_EVENT_TOPIC_SLUG = 'song-submission-topic'

export class EventService {
  private connectionRepository: ConnectionRepository;
  private submissionRepository: SubmissionRepository;
  
  constructor() {
    this.connectionRepository = new ConnectionRepository()
    this.submissionRepository = new SubmissionRepository()
  }


  async handleSubmissionEvent(dto: SubmissionEventModelDTO) {
    console.log('handle submission data', dto)
    if(dto.data?.eventTopicPath === TRUFFLE_WEBHOOK_VERIFICATION_CHALLENGE) {
      return new Response(dto.data.challenge, { status: 200 })
    }


    if(!isTargetEventTopicByPath(dto.data?.eventTopicPath!, SUBMISSION_EVENT_TOPIC_SLUG)) {
      throw new BadRequestError('Incorrect eventTopicPath')
    }

    // record a submission
    console.log('additional data', dto.data?.data)

    const orgId = dto.data?.orgId
    const userId = dto.data?.data?.userId
    const link = dto.data?.data?.additionalData?.link

    console.log({
      orgId,
      userId
    })

    if(orgId && userId) {
      // fetch user youtube connection
      const userYoutubeConnection = await this.connectionRepository.getYouTubeConnection(orgId, userId)
      const username = userYoutubeConnection?.orgUser?.name ?? userYoutubeConnection?.orgUser?.user?.name

      console.log('userYoutubeConnection', userYoutubeConnection)

      if(!userYoutubeConnection?.sourceId) {
        throw new BadRequestError('Truffle user missing YT User ID')
      }

      if(!link) {
        throw new BadRequestError('Missing song link')
      }

      // check for duplicate submission
      const existingSubmission = await this.submissionRepository.getByOrgIdAndLink(orgId, link)
      console.log('existingSubmission', existingSubmission)

      // // TODO bring this back
      // if(existingSubmission) {
      //   throw new BadRequestError('Link already submitted')
      // }

      // const existingUserSubmission = await this.submissionRepository.getByOrgIdAndUserId(orgId, userId)

      // if(existingUserSubmission) {
      //   throw new BadRequestError('User already submitted')
      // }

      let title 
      let userProfileUrl
      let channelTitle
      let songDurationMs
      
      try {
        const channelInfo = await InnertubeRepository.getChannel(userYoutubeConnection?.sourceId)
        
        console.log('has channel info')
        channelTitle = channelInfo?.metadata?.title
        userProfileUrl = channelInfo?.metadata?.thumbnail?.[0]?.url

        // fetch the song from innertube
        const videoId = InnertubeRepository.getVideoId(link)
    
        const videoDetails = await InnertubeRepository.getVideoDetails(videoId)

        console.log('has video details')
        title = videoDetails.basic_info.title
        songDurationMs = videoDetails?.basic_info?.duration * 1000
      } catch (error) {
        console.error('error fetching from innertube', error)
      }

      const upsertedSubmission = await this.submissionRepository.upsert({
        orgId,
        userId,
        username,
        channelTitle,
        userProfileUrl,
        title,
        connectionType: 'youtube',
        connectionId: userYoutubeConnection?.sourceId,
        link,
        songDurationMs,
        status: 'review'
      })

      console.log('upsertedSubmission', upsertedSubmission)
    }

    return Content(`Pong`)
  }
}