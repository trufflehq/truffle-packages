import {
  ImageByAspectRatio,
  jumper,
  React,
  signal,
  useMemo,
  useSelector,
  useSignal,
  useStyleSheet,
} from "../../deps.ts";
import { getOAuthUrl, OAuthSourceType } from "../../shared/mod.ts";
import { usePostTruffleAccessTokenToParent } from "./hooks.ts";

import Button from "../button/button.tsx";
import stylesheet from "./oauth-button.scss.js";

interface NewWindowProps {
  onClose: (() => void) | undefined;
  url: string;
  target: string;
  options: {
    style: {
      top: number;
      left: number;
      right: number;
      bottom: number;
      width: number;
      height: number;
    };
  };
  isNative?: boolean;
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
  const extensionInfo$ = useSignal(jumper.call("context.getInfo"));

  const oauthUrlPromise = useMemo(() => {
    return getOAuthUrl(sourceType, truffleAccessToken, orgId);
  }, [truffleAccessToken, orgId]);

  // listen for the new window to send us an accessToken, then post back to parent iframe
  usePostTruffleAccessTokenToParent();

  const isNative = useSelector(() => {
    const info = extensionInfo$.get();

    return info?.platform === "native-ios" ||
      info?.platform === "native-android";
  });

  return (
    <Button
      className={`${sourceType} oauth-button`}
      onClick={async () => {
        const url = await oauthUrlPromise;
        openWindow({
          url,
          options: {
            style: {
              width: 450,
              height: 600,
              top: 200,
              left: 400,
              right: 0,
              bottom: 0,
            },
          },
          target: "_blank",
          onClose,
          isNative,
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
  { url, options, onClose, isNative }: NewWindowProps,
) {
  // TODO: method to get current platform (detect if native app, etc...)
  // const isNative = isNative(); // window?.ReactNativeWebView;
  // window?.ReactNativeWebView?.postMessage(JSON.stringify(embedConnection));

  const openWindowFn = isNative ? openWindowNative : openWindowBrowser;
  const target = "_blank";

  openWindowFn({ url, target, options, onClose });
}

function openWindowBrowser({ url, target, options, onClose }): void {
  const { width, height, left, right, top, bottom } = options.style;
  const windowFeatures =
    `width=${width},height=${height},left=${left},right=${right},top=${top},bottom=${bottom}`;
  // jumper doesn't yet support passing messages from opened windows, so have to do manually
  const openedWindow = window.open(url, target, windowFeatures);
  const timer = setInterval(() => {
    if (openedWindow.closed) {
      clearInterval(timer);
      onClose?.();
    }
  }, 250);
}

function openWindowNative({ url, target, options }: NewWindowProps): void {
  // we don't need to know when this closes. jumper handles updating the accessToken
  jumper.call("browser.openWindow", { url, target, options });
}
