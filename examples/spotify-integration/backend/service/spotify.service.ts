import { InternalServerError, Content } from "alosaur/mod.ts";
import { SpotifyRepository } from "../repositories/spotify.repository.ts";
import { SpotifyAuthRepository } from "../repositories/spotify-auth.repository.ts";
import { SpotifyCacheRepository } from '../repositories/spotify-cache.repository.ts'


export class SpotifyService {
  private spotifyRepository: SpotifyRepository;
  private spotifyAuthRepository: SpotifyAuthRepository;
  private spotifyCacheRepository: SpotifyCacheRepository;

  constructor() {
    this.spotifyRepository = new SpotifyRepository();
    this.spotifyAuthRepository = new SpotifyAuthRepository()
    this.spotifyCacheRepository = new SpotifyCacheRepository()
  }

  requestAuthorization(orgId?: string) {
    return this.spotifyRepository.requestAuthorization(orgId)
  }

  async handleAuth(orgId: string, code: string) {
    const authToken = await this.spotifyRepository.fetchAuthToken(code);

    if (!authToken) {
      throw new InternalServerError("Missing auth token");
    }

    await this.spotifyAuthRepository.upsertAuth(orgId, authToken);

    return new Response("OK", { status: 200 });
  }

  async getActiveSong(orgId?: string) {
    if(!orgId) {
      throw new InternalServerError("Missing orgId");
    }

    const cachedSong = await this.spotifyCacheRepository.getCacheByOrgIdAndType(orgId, 'songInfo')

    if(!cachedSong.isExpired) {
      return Content(cachedSong.data, 200)
    }


    const auth = await this.getAuth(orgId)

    if(auth)  {
      const song = await this.spotifyRepository.getCurrentlyPlayingSong(auth)
  
      await this.spotifyCacheRepository.upsert(orgId, 'songInfo', song)

      return Content(song, 200)
    } else {
      throw new InternalServerError('missing auth token')
    }
  }

  async getAuth(orgId?: string) {
    if(!orgId) {
      throw new InternalServerError("Missing orgId");
    }

    const auth = await this.spotifyAuthRepository.getAuthByOrgId(orgId)

    if (auth) {
      const expirationTime = new Date(auth?.expirationTime);

      console.log("expirationTime", expirationTime);

      if (this.spotifyAuthRepository.isTimestampExpired(expirationTime)) {
        console.log('auth expired')

        const refreshedAuthToken = await this.spotifyRepository.refreshAuth(auth)
        const refreshedAuth = await this.spotifyAuthRepository.upsertAuth(orgId, refreshedAuthToken)

        return refreshedAuth
      } else {
        return auth;
      }
    }
  }
}
