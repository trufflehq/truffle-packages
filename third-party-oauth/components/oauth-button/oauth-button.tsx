import {
  ImageByAspectRatio,
  React,
  useEffect,
  useState,
  useStyleSheet,
} from "../../deps.ts";
import { getOAuthUrl, OAuthSourceType } from "../../shared/mod.ts";
import { usePostTruffleAccessTokenToParent} from './hooks.ts'

import NewWindow from "../new-window/new-window.tsx";
import Button from "../button/button.tsx";
import stylesheet from "./oauth-button.scss.js";

function getSourceTypeTitle(sourceType: OAuthSourceType) {
  return sourceType === "youtube" ? "YouTube" : "Twitch";
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
      <ImageByAspectRatio
        imageUrl={getSourceTypeIcon(sourceType)}
        widthPx={24}
        height={24}
        aspectRatio={1}
      />
      {`Link your ${getSourceTypeTitle(sourceType)} account`}
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
