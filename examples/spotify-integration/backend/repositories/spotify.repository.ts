import { BadRequestError, InternalServerError, Redirect } from "alosaur/mod.ts";
import * as queryString from "https://deno.land/x/querystring@v1.0.2/mod.js";
import { SpotifyAuthToken, SpotifyAuthRecord, SpotifySongResponse, SpotifySong } from './types.ts'
const REDIRECT_URI = "https://spotify-song-info.deno.dev/spotify/auth/callback";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const CURRENTLY_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";

export class SpotifyRepository {
  requestAuthorization(orgId?: string) {
    const params = queryString.stringify({
      client_id: Deno.env.get("SPOTIFY_CLIENT_ID")!,
      response_type: "code",
      redirect_uri: REDIRECT_URI,
      show_dialog: "true",
      state: `orgId=${encodeURIComponent(orgId || "")}`,
      scope: "user-read-currently-playing user-read-playback-position",
    });

    return Redirect(`${AUTHORIZE_ENDPOINT}?${params}`);
  }

  async fetchAuthToken(code: string) {
    const tokenResponse = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + btoa(`${Deno.env.get("SPOTIFY_CLIENT_ID")!}:${Deno.env.get("SPOTIFY_CLIENT_SECRET")!}`),
      },
      body: new URLSearchParams({
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
      }),
    });

    if (tokenResponse.status === 200) {
      const tokenData: SpotifyAuthToken = await tokenResponse.json();

      return tokenData;
    } else {
      throw new BadRequestError("Invalid request in auth callback");
    }
  }

  async refreshAuth(auth: SpotifyAuthRecord) {
    const tokenResponse = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + btoa(`${Deno.env.get("SPOTIFY_CLIENT_ID")!}:${Deno.env.get("SPOTIFY_CLIENT_SECRET")!}`),
      },
      body: new URLSearchParams({
        "grant_type": "refresh_token",
        "refresh_token": auth.refresh_token,
      }),
    });

    if (tokenResponse.status === 200) {
      const tokenData: SpotifyAuthToken = await tokenResponse.json();

      return tokenData;
    } else {
      throw new BadRequestError("Invalid request in while refreshing auth token");
    }
  }

  async getCurrentlyPlayingSong(auth: SpotifyAuthRecord) {
    const songResponse = await fetch(
      CURRENTLY_PLAYING_ENDPOINT,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.access_token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (songResponse.status !== 200) {
      const errorText = await songResponse.text();

      throw new InternalServerError(
        `${songResponse.status} Error getting currently playing song ${errorText ? `(${errorText})` : ""}`,
      );
    }
    const song: SpotifySongResponse = await songResponse.json();

    console.log("song", song);

    return this.normalizeSong(song);
  }

  normalizeSong(song: SpotifySongResponse): SpotifySong {
    return {
      title: song.item.name,
      artists: song.item.artists,
      album: song.item.album.name,
      link: song.item.external_urls.spotify,
      position: song.progress_ms,
      length: song.item.duration_ms,
      images: song.item.album.images,
      is_playing: song.is_playing,
    };
  }
}
