import {
  ImageByAspectRatio,
  jumper,
  React,
  useMemo,
  useStyleSheet,
} from "../../deps.ts";
import { getOAuthUrl, OAuthSourceType } from "../../shared/mod.ts";
import { usePostTruffleAccessTokenToParent } from "./hooks.ts";

import Button from "../button/button.tsx";
import stylesheet from "./oauth-button.scss.js";

interface NewWindowProps {
  onClose: (() => void) | undefined;
  url?: string;
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

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

  const oauthUrlPromise = useMemo(() => {
    return getOAuthUrl(sourceType, truffleAccessToken, orgId);
  }, [truffleAccessToken, orgId]);

  // listen for the new window to send us an accessToken, then post back to parent iframe
  usePostTruffleAccessTokenToParent();

  return (
    <Button
      className={`${sourceType} oauth-button`}
      onClick={async () => {
        const url = await oauthUrlPromise;
        openWindow({
          url,
          width: 450,
          height: 600,
          top: 200,
          left: 400,
          right: 0,
          bottom: 0,
          onClose,
        });
      }}
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
    </Button>
  );
}

function openWindow(
  { url, width, height, top, right, bottom, left, onClose }: NewWindowProps,
) {
  // TODO: method to get current platform (detect if native app, etc...)
  const isNative = window?.ReactNativeWebView;
  const openWindowFn = isNative ? openWindowNative : openWindowBrowser;
  const target = "_blank";
  const options =
    `width=${width},height=${height},left=${left},right=${right},top=${top},bottom=${bottom}`;
  const openedWindow = openWindowFn({ url, target, options });
  // FIXME: detect if webview is closed
  const timer = setInterval(function () {
    if (openedWindow.closed) {
      clearInterval(timer);
      onClose?.();
    }
  }, 250);
}

function openWindowBrowser({ url, target, options }) {
  // can't use jumper.call here since it'll use injection script jumper
  // which doesn't show if window is opened or closed
  return window.open(url, target, options);
}

function openWindowNative({ url, target, options }) {
  return jumper.call("browser.openWindow", { url, target, options });
}
