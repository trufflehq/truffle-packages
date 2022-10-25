import { OAuthSourceType, signJwt } from "../mod.ts";

// TODO — figure out a better way to detect environments vs. using window._truffleInitialData
const REDIRECT_URI = window?._truffleInitialData?.clientConfig?.IS_STAGING_ENV
  ? "http://localhost:50230/redirect/callback" // "https://platform-third-party-oauth.sporocarp.dev/redirect/callback"
  : window?._truffleInitialData?.clientConfig?.IS_PROD_ENV
  ? "https://third-party-oauth.truffle.vip/redirect/callback"
  : "http://localhost:50230/redirect/callback";
const AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const SCOPES = [
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
];

const GOOGLE_CLIENT_ID =
  window?._truffleInitialData?.clientConfig?.IS_STAGING_ENV
    ? "553820530287-q469ekatefosqqt4fs03ap985inudto4.apps.googleusercontent.com"
    : "710684531554-58ngiqv3jreg88ns30s3vkptb401rja1.apps.googleusercontent.com";

export const getYouTubeOAuthUrl = async (
  accessToken: string,
  orgId: string,
) => {
  const stateStr = await signJwt("youtube", accessToken, orgId);

  return AUTHORIZE_URL +
    `?client_id=${GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${REDIRECT_URI}` +
    "&include_granted_scopes=true" +
    "&response_type=token" +
    "&duration=permanent" +
    `&scope=${SCOPES.join(" ")}` +
    `&state=${stateStr}`;
};

export const getOAuthUrl = (
  sourceType: OAuthSourceType,
  accessToken: string,
  orgId: string,
) => sourceType === "youtube" ? getYouTubeOAuthUrl(accessToken, orgId) : "";
