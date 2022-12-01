import { _, React, useStyleSheet } from "../../../deps.ts";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import ThemeComponent from "../../../components/theme-component/theme-component.tsx";
import stylesheet from "./page.scss.js";
import ErrorRenderer from "../../../components/error-renderer/error-renderer.tsx";
import LoginManager from "../../../components/login-manager/login-manager.tsx";
import { useGoogleFontLoader } from "https://tfl.dev/@truffle/utils@~0.0.17/google-font-loader/mod.ts";

interface AuthCallbackHashParams extends URLSearchParams {
  access_token?: string;
  state?: string;
  error?: string;
}

const hashParams: AuthCallbackHashParams = new Proxy(
  new URLSearchParams(window.location.hash.substring(1)),
  {
    get: (searchParams, prop: string) => searchParams.get(prop),
  },
);

const OAUTH_ERROR_MESSAGE: Record<string, { title: string; message: string }> = {
  // passed if the user hits cancel at the OAuth consent screen
  "access_denied": {
    title: "Access error",
    message: "You must grant Truffle access to read your YouTube account to continue.",
  },
  undefined: {
    title: "Error",
    message: "Error during login",
  },
};

function AuthCallbackPage() {
  useStyleSheet(stylesheet);
  useGoogleFontLoader(() => ["Inter"], []);
  const oAuthAccessToken = hashParams?.access_token;
  const state = hashParams?.state;
  const error = hashParams?.error;

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
        : <LoginManager oAuthAccessToken={oAuthAccessToken} state={state} />}
    </>
  );
}

export default toDist(AuthCallbackPage, import.meta.url);
