import { React } from "../../deps.ts";
import { OAuthSourceType } from "../../shared/mod.ts";

const DEFAULT_STYLES: React.CSSProperties = {
  width: "308px",
  height: "42px",
  margin: "20px auto",
  border: "none",
};

export default function OAuthIframe({ sourceType, accessToken, orgId, styles = DEFAULT_STYLES }: {
  sourceType: OAuthSourceType;
  accessToken: string;
  orgId: string;
  styles: React.CSSProperties;
}) {
  return (
    <iframe
      src={`https://third-party-oauth.truffle.vip/auth/${sourceType}?accessToken=${accessToken}&orgId=${orgId}`}
      style={styles}
    />
  );
}
