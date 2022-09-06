import { React, useEffect } from "../../../deps.ts";
import { useParams } from "https://tfl.dev/@truffle/router@^1.0.0/index.ts";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.5/format/wc/react/index.ts";
import { OAuthSourceType, setAccessToken } from "../../../shared/mod.ts";
import OAuthButton from "../../../components/oauth-button/oauth-button.tsx";

interface OAuthSourceTypeParams extends URLSearchParams {
  accessToken?: string;
  orgId?: string;
}
const hasSourceType = (sourceType?: OAuthSourceType) =>
  sourceType === "youtube" || sourceType === "twitch";

function AuthPage() {
  const params = useParams();

  const sourceType = params?.sourceType;

  const urlParams: OAuthSourceTypeParams = new Proxy(
    new URLSearchParams(window.location.search),
    {
      get: (searchParams, prop: string) => searchParams.get(prop),
    },
  );

  const accessToken = urlParams?.accessToken;
  const orgId = urlParams?.orgId;

  useEffect(() => {
    setAccessToken(accessToken);
  }, [accessToken]);

  console.log({
    sourceType,
    accessToken,
    orgId,
  });

  return (
    <div className="c-auth-page">
      {hasSourceType(sourceType) && accessToken && orgId
        ? (
          <OAuthButton
            sourceType={sourceType}
            truffleAccessToken={accessToken}
            orgId={orgId}
          />
        )
        : (
          <div>
            Missing Params
          </div>
        )}
    </div>
  );
}

export default toDist(AuthPage, import.meta.url);
