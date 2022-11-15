import { _, React, useStyleSheet } from "../../../deps.ts";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import ThemeComponent from "https://tfl.dev/@truffle/mogul-menu@^0.1.59/components/base/theme-component/theme-component.tsx";
import stylesheet from "./page.scss.js";
import ErrorRenderer from "../../../components/error-renderer/error-renderer.tsx";
import LoginManager from "../../../components/login-manager/login-manager.tsx";

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

const OAUTH_ERROR_MESSAGE = {
  // passed if the user hits cancel at the OAuth consent screen
  "access_denied":
    "You must grant Truffle access to read your YouTube account to continue.",
};

function AuthCallbackPage() {
  useStyleSheet(stylesheet);
  const oAuthAccessToken = hashParams?.access_token;
  const state = hashParams?.state;
  const error = hashParams?.error;

  return (
    <>
      <ThemeComponent />
      {error
        ? (
          <ErrorRenderer
            message={OAUTH_ERROR_MESSAGE[error] ?? "Error during login"}
          />
        )
        : <LoginManager oAuthAccessToken={oAuthAccessToken} state={state} />}
    </>
  );
}

export default toDist(AuthCallbackPage, import.meta.url);
