import { _, globalContext, jumper, React } from "../../../deps.ts";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.19/format/wc/react/index.ts";
import ThemeComponent from "https://tfl.dev/@truffle/mogul-menu@^0.1.59/components/base/theme-component/theme-component.tsx";

import LoginManager from "../../../components/login-manager/login-manager.tsx";

interface AuthCallbackHashParams extends URLSearchParams {
  access_token?: string;
  state?: string;
}

const hashParams: AuthCallbackHashParams = new Proxy(
  new URLSearchParams(window.location.hash.substring(1)),
  {
    get: (searchParams, prop: string) => searchParams.get(prop),
  },
);

function AuthCallbackPage() {
  const oAuthAccessToken = hashParams?.access_token;
  const state = hashParams?.state;
  jumper.call("platform.log", "hello");
  const context = globalContext.getStore();
  window.ReactNativeWebView?.postMessage(`auth callback ${JSON.stringify(context)}`);
  jumper.call("platform.log", `auth callback page ${JSON.stringify(state)}`);

  console.log("auth callback page", state);

  return (
    <>
      <ThemeComponent />
      <LoginManager oAuthAccessToken={oAuthAccessToken} state={state} />;
    </>
  );
}

export default toDist(AuthCallbackPage, import.meta.url);
