import { ImageByAspectRatio, React, useEffect, useState, useStyleSheet } from "../../deps.ts";
import { getOAuthUrl, OAuthSourceType } from "../../shared/mod.ts";
import { usePostTruffleAccessTokenToParent } from "./hooks.ts";

import NewWindow from "../new-window/new-window.tsx";
import Button from "../button/button.tsx";
import stylesheet from "./oauth-button.scss.js";

function getSourceTypeTitle(sourceType: OAuthSourceType) {
  return sourceType === "youtube" ? "YouTube" : "Twitch";
}

export type ButtonTextVariant = "signup" | "login";

function getTextVariant(variant: ButtonTextVariant) {
  return variant === "signup" ? "Connect" : "Login with";
}

function getSourceTypeIcon(sourceType: OAuthSourceType) {
  return sourceType === "youtube"
    ? "https://cdn.bio/assets/images/features/browser_extension/youtube.svg"
    : "";
}

export default function OAuthButton(
  {
    sourceType = "youtube",
    truffleAccessToken,
    orgId,
    onClose,
    variant = "signup",
  }: {
    sourceType?: OAuthSourceType;
    truffleAccessToken: string;
    orgId: string;
    onClose?: () => void;
    variant?: ButtonTextVariant;
  },
) {
  useStyleSheet(stylesheet);
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    const getUrl = async () => {
      const oAuthUrl = await getOAuthUrl(sourceType, truffleAccessToken, orgId);
      window?.ReactNativeWebView?.postMessage(`oauth url ${oAuthUrl}`);

      setUrl(oAuthUrl);
    };
    getUrl();
  }, [truffleAccessToken, orgId]);

  usePostTruffleAccessTokenToParent();

  const onWindowClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  window?.ReactNativeWebView?.postMessage(`isOpen ${isOpen}`);

  return (
    <Button
      className={`${sourceType} oauth-button`}
      onClick={() => setIsOpen(true)}
    >
      <div className="logo">
        <ImageByAspectRatio
          imageUrl={getSourceTypeIcon(sourceType)}
          widthPx={24}
          height={24}
          aspectRatio={1}
        />
        {`${getTextVariant(variant)} ${getSourceTypeTitle(sourceType)}`}
      </div>
      {isOpen && (
        <NewWindow
          onClose={onWindowClose}
          url={url}
          width={450}
          height={600}
          top={200}
          left={400}
          right={0}
          bottom={0}
        />
      )}
    </Button>
  );
}
