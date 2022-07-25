export type SpotifyAuthRecord = {
  orgId: string;
  access_token: string;
  refresh_token: string;
  expirationTime: Date;
  data: Record<string, unknown>;
};

export type SpotifyCacheType = 'songInfo'
export type SpotifyCacheData = SpotifySong

export type SpotifyCacheRecord = {
  orgId: string
  type: SpotifyCacheType
  // Postgres timestamp
  ttl: Date
  data: SpotifyCacheData
  
  // resolved after read
  isExpired?: boolean
}

type SpotifySongAlbum = {
  name: string;
  images: Record<string, unknown>;
};

export type SpotifySongResponse = {
  item: {
    name: string;
    artists: Record<string, unknown>;
    album: SpotifySongAlbum
    external_urls: {
      spotify: string;
    };
    progress_ms: number;
    duration_ms: number;
  };
  progress_ms: number;
  is_playing: boolean;
};

export type SpotifySong = {
  title: string,
  artists: Record<string, unknown>,
  album: string,
  link: string,
  position: number,
  length: number,
  images: Record<string, unknown>,
  is_playing: boolean,
}

export type SpotifyAuthToken = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
};
