import { React } from "../../deps.ts";
import { OAuthSourceType } from "../../shared/mod.ts";
import { ButtonTextVariant } from "../oauth-button/oauth-button.tsx";
const DEFAULT_STYLES: React.CSSProperties = {
  width: "308px",
  height: "42px",
  margin: "20px auto",
  border: "none",
};

function getIframeUrl(
  sourceType: OAuthSourceType,
  accessToken: string,
  orgId: string,
  variant?: string,
) {
  // TODO — figure out a better way to detect environment than window._truffleInitialData
  return window?._truffleInitialData?.clientConfig?.IS_STAGING_ENV
    ? `https://mobile-third-party-oauth.sporocarp.dev/auth/${sourceType}?accessToken=${accessToken}&orgId=${orgId}${
      variant ? `&variant=${variant}` : ""
    }`
    : `https://mobile-third-party-oauth.truffle.vip/auth/${sourceType}?accessToken=${accessToken}&orgId=${orgId}${
      variant ? `&variant=${variant}` : ""
    }`;
}6a919990-5405-11ed-8343-4b6ae9136707
export default function OAuthIframe(
  { sourceType, accessToken, orgId, variant, styles = DEFAULT_STYLES }: {
    sourceType: OAuthSourceType;
    accessToken: string;
    orgId: string;
    variant?: ButtonTextVariant;
    styles: React.CSSProperties;
  },
) {
  return (
    <iframe
      src={getIframeUrl(sourceType, accessToken, orgId, variant)}
      style={styles}
    />
  );
}
