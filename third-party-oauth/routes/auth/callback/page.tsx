import { _, React } from "../../../deps.ts";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.5/format/wc/react/index.ts";
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
  const ytAccessToken = hashParams?.access_token;
  const state = hashParams?.state;

  return <LoginManager ytAccessToken={ytAccessToken} state={state} />;
}

export default toDist(AuthCallbackPage, import.meta.url);
