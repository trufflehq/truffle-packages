import { React, setAccessToken, useEffect } from "../../../deps.ts";
import { useParams } from "https://tfl.dev/@truffle/router@^1.0.0/index.ts";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import { OAuthSourceType } from "../../../shared/mod.ts";
import OAuthButton, {
  ButtonTextVariant,
} from "../../../components/oauth-button/oauth-button.tsx";

interface OAuthSourceTypeParams extends URLSearchParams {
  accessToken?: string;
  orgId?: string;
  variant?: ButtonTextVariant;
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
  const variant = urlParams?.variant;

  // shouldn't be necessary
  // useEffect(() => {
  //   setAccessToken(accessToken);
  // }, [accessToken]);

  console.log({
    sourceType,
    accessToken,
    orgId,
    variant,
  });

  const hasParams = hasSourceType(sourceType) && accessToken && orgId;
  if (!hasParams) {
    console.error("missing params", { sourceType, accessToken, orgId });
    return <></>;
  }

  return (
    <div className="c-auth-page">
      <OAuthButton
        sourceType={sourceType}
        truffleAccessToken={accessToken}
        orgId={orgId}
        variant={variant}
      />
    </div>
  );
}

export default toDist(AuthPage, import.meta.url);
