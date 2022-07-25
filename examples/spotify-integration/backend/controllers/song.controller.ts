import { Controller, Get, QueryParam } from "alosaur/mod.ts";
import { SpotifyService } from '../service/spotify.service.ts'

@Controller("/song")
export class SongController {
  private spotifyService: SpotifyService;

  constructor() {
    this.spotifyService = new SpotifyService() 
  }
  // TODO - switch this over to DI once this is working w/ Supabase or Deno Deploy
  // constructor(private spotifyRepository: SpotifyRepository) {}

  @Get("/info")
  song(@QueryParam('orgId') orgId: string) {
   return this.spotifyService.getActiveSong(orgId)
  }
}
