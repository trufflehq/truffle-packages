import { Controller, Get, QueryParam, BadRequestError } from "alosaur/mod.ts";
import { SpotifyService } from '../service/spotify.service.ts'

@Controller("/auth")
export class SpotifyAuthController {
  private spotifyService: SpotifyService;

  constructor() {
    this.spotifyService = new SpotifyService() 
  }
  // TODO - switch this over to DI once Deno Deploy support emitDecoratorMetadata
  // constructor(private spotifyRepository: SpotifyRepository) {}

  @Get("/login")
  login(@QueryParam('orgId') orgId: string) {
   return this.spotifyService.requestAuthorization(orgId)
  }

  @Get("/callback")
  callback(@QueryParam('code') code: string, @QueryParam('state') state: string) {
    const stateParams = new URLSearchParams(state);
    const orgId = stateParams.get('orgId')

    if(!orgId) {
      throw new BadRequestError('Missing orgId')
    }


    return this.spotifyService.handleAuth(orgId, code)
  }
}
