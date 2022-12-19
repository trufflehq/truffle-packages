import { _, React, useEffect, useStyleSheet } from "../../../deps.ts";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import stylesheet from "./page.scss.js";
import ErrorRenderer from "../../../components/error-renderer/error-renderer.tsx";
import ThemeComponent from "../../../components/theme-component/theme-component.tsx";
import {
  JetPackSnuffle,
  sendTruffleAccessTokenToOpener,
} from "../../../components/login-manager/login-manager.tsx";
import { useGoogleFontLoader } from "https://tfl.dev/@truffle/utils@~0.0.3/google-font-loader/mod.ts";

interface AuthCallbackHashParams extends URLSearchParams {
  truffleAccessToken?: string;
  orgId?: string;
  error?: string;
}

const hashParams: AuthCallbackHashParams = new Proxy(
  new URLSearchParams(window.location.hash.substring(1)),
  {
    get: (searchParams, prop: string) => searchParams.get(prop),
  },
);

const OAUTH_ERROR_MESSAGE: Record<string, { title: string; message: string }> =
  {
    // passed if the user hits cancel at the OAuth consent screen
    "access_denied": {
      title: "Access error",
      message:
        "You must grant Truffle access to read your YouTube account to continue.",
    },
    undefined: {
      title: "Error",
      message: "Error during login",
    },
  };

function AuthCallbackPage() {
  useStyleSheet(stylesheet);
  useGoogleFontLoader(() => ["Inter"], []);
  const truffleAccessToken = hashParams?.truffleAccessToken;
  const error = hashParams?.error;

  useEffect(() => {
    if (truffleAccessToken) {
      sendTruffleAccessTokenToOpener(truffleAccessToken, hashParams?.orgId);
    }
  }, [truffleAccessToken]);

  return (
    <>
      <ThemeComponent />
      {error
        ? (
          <ErrorRenderer
            title={OAUTH_ERROR_MESSAGE[error]?.title}
            message={OAUTH_ERROR_MESSAGE[error]?.message}
          />
        )
        : <JetPackSnuffle />}
    </>
  );
}

export default toDist(AuthCallbackPage, import.meta.url);
