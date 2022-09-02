import { jose } from '../../deps.ts'
export type OAuthSourceType = 'youtube' | 'twitch'

export interface DecodedAuth extends jose.JWTPayload {
  accessToken?: string;
  orgId?: string;
  sourceType?: OAuthSourceType;
}

export interface OAuthResponse {
  userName?: string
  truffleAccessToken?: string
  type?: string
}