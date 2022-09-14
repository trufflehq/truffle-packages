import { Controller, Post, Body } from "alosaur/mod.ts";
import { EventService } from '../services/event.service.ts'
import { SubmissionEventModelDTO } from '../models/mod.ts'
@Controller()
export class EventController {
  private eventService: EventService

  constructor() {
    this.eventService = new EventService() 
  }
  // TODO - switch this over to DI once Deno Deploy supports emitDecoratorMetadata
  // constructor(private spotifyRepository: SpotifyRepository) {}

  @Post("/submission")
  song(@Body(SubmissionEventModelDTO) dto: SubmissionEventModelDTO) {

    return this.eventService.handleSubmissionEvent(dto)
  }
}
