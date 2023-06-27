import { ConnectionSourceType, React } from "../../../deps.ts";

const LOCAL_HOSTNAME = "https://platform-third-party-oauth.sporocarp.dev";

export default function LocalOAuthFrame(
  { sourceType, accessToken, orgId }: {
    sourceType: ConnectionSourceType;
    accessToken: string;
    orgId: string;
  },
) {
  return (
    <iframe
      src={`${LOCAL_HOSTNAME}/auth/${sourceType}?accessToken=${accessToken}&orgId=${orgId}`}
      style={{
        width: "236px",
        height: "42px",
        margin: "20px auto 8px auto",
        border: "none",
      }}
    />
  );
}
