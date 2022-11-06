import {
  gql,
  jumper,
  mutation,
  React,
  setAccessToken,
  setOrgId,
  useEffect,
  useState,
  useStyleSheet,
} from "../../deps.ts";
import { DecodedAuth, MESSAGES, verifyJWT } from "../../shared/mod.ts";

import stylesheet from "./login-manager.scss.js";

export const ME_QUERY = gql`
  query {
    me {
      id
      name
      email
      phone
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginQuery ($connectionSourceType: String, $connectionPrivateData: JSON) {
    userLoginConnection(input: { connectionSourceType: $connectionSourceType, connectionPrivateData: $connectionPrivateData}) {
      accessToken
    }
  }
`;

export default function LoginManager(
  { oAuthAccessToken, state }: {
    oAuthAccessToken?: string;
    state?: string;
  },
) {
  useStyleSheet(stylesheet);
  const [error, setError] = useState<string>();
  jumper.call("platform.log", "login manager");
  window.ReactNativeWebView?.postMessage("auth callback");

  useEffect(() => {
    oAuthAccessToken && state && (async () => {
      const truffleAccessToken = await truffleConnectionLogin(
        oAuthAccessToken,
        state,
      );
      setError(truffleAccessToken);
      // if (truffleAccessToken) {
      // }

      try {
        sendTruffleAccessTokenToOpener(truffleAccessToken);
      } catch (err) {
        setError("Error logging in");
      }
    })();
  }, [oAuthAccessToken, state]);

  return (
    <div className="c-login-manager">
      <div className="inner">
        <div className="snuffle">
          <object
            data="https://cdn.bio/assets/images/landing/snuffle.svg?1"
            type="image/svg+xml"
          >
            <img src="https://cdn.bio/assets/images/landing/snuffle.svg?1" />
          </object>
        </div>
        <div className="title">Logging in...</div>
        {error && (
          <div className="error">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

async function truffleConnectionLogin(
  oAuthAccessToken: string,
  state: string,
): Promise<string | null> {
  const { orgId, accessToken: truffleAccessToken, sourceType } = await decodeState(state) || {};

  // jumper.call(
  //   "platform.log",
  //   `truffleConnectionLogin ${JSON.stringify({ orgId, truffleAccessToken, sourceType })}`,
  // );

  window.ReactNativeWebView?.postMessage(
    `truffleConnectionLogin ${
      JSON.stringify({ orgId, truffleAccessToken, sourceType, oAuthAccessToken })
    }`,
  );

  window.ReactNativeWebView?.postMessage(JSON.stringify(window?._truffleInitialData));

  console.log({ orgId, truffleAccessToken, sourceType });
  // login as this OrgUser
  setAccessToken(truffleAccessToken);
  if (orgId) {
    setOrgId(orgId);
  }

  // attempt to login via connection
  // - if a connection doesn't exist, it'll add the connection for existing OrgUser
  //   and return same accessToken
  // - if a connection does exist, it'll log the user in as the OrgUser the connection
  //   exists for and return that user's accessToken
  const result = await mutation(LOGIN_MUTATION, {
    connectionSourceType: sourceType,
    connectionPrivateData: { accessToken: oAuthAccessToken },
  });

  window.ReactNativeWebView?.postMessage(
    `result ${JSON.stringify(result?.data)} ${JSON.stringify(result?.error)}`,
  );

  console.log("result", result);

  return result?.data?.userLoginConnection?.accessToken;
}

async function decodeState(state: string): Promise<DecodedAuth | null> {
  return state ? await verifyJWT(state) : null;
}

function sendTruffleAccessTokenToOpener(truffleAccessToken) {
  const payload = {
    type: MESSAGES.SET_ACCESS_TOKEN,
    truffleAccessToken,
  };

  window.ReactNativeWebView?.postMessage(`window.opener ${window.opener} ${window.close}`);
  window.ReactNativeWebView?.postMessage(JSON.stringify(payload));

  window.close();
  window.opener?.postMessage(JSON.stringify(payload), "*");
  const self = window.self;
  self.opener = window.self;
  self.close();
}
