import {
  ImageByAspectRatio,
  React,
  useEffect,
  useState,
  useStyleSheet,
} from "../../deps.ts";
import { getOAuthUrl, OAuthSourceType } from "../../shared/mod.ts";
import { usePostTruffleAccessTokenToParent } from "./hooks.ts";

import NewWindow from "../new-window/new-window.tsx";
import Button from "../button/button.tsx";
import stylesheet from "./oauth-button.scss.js";

function getSourceTypeIcon(sourceType: OAuthSourceType) {
  return sourceType === "youtube"
    ? "https://cdn.bio/assets/images/features/browser_extension/yt_logo_mono_dark.png"
    : "";
}

export default function OAuthButton(
  {
    sourceType = "youtube",
    truffleAccessToken,
    orgId,
    onClose,
  }: {
    sourceType?: OAuthSourceType;
    truffleAccessToken: string;
    orgId: string;
    onClose?: () => void;
  },
) {
  useStyleSheet(stylesheet);
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    const getUrl = async () => {
      const oAuthUrl = await getOAuthUrl(sourceType, truffleAccessToken, orgId);
      setUrl(oAuthUrl);
    };
    getUrl();
  }, [truffleAccessToken, orgId]);

  usePostTruffleAccessTokenToParent();

  const onWindowClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <Button
      className={`${sourceType} oauth-button`}
      onClick={() => setIsOpen(true)}
    >
      <span>
        {"Connect your"}
      </span>
      <div className="logo">
        <ImageByAspectRatio
          imageUrl={getSourceTypeIcon(sourceType)}
          widthPx={104}
          height={24}
          aspectRatio={3}
        />
      </div>
      <span>
        {`account`}
      </span>
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
