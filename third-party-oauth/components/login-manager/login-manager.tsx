import {
  gql,
  mutation,
  React,
  setAccessToken,
  setOrgId,
  useEffect,
  useState,
  useStyleSheet,
} from "../../deps.ts";
import { DecodedAuth, MESSAGES, verifyJWT } from "../../shared/mod.ts";
import ErrorRenderer from "../error-renderer/error-renderer.tsx";
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

  useEffect(() => {
    oAuthAccessToken && state && (async () => {
      let truffleAccessToken;
      try {
        try {
          truffleAccessToken = await truffleConnectionLogin(
            oAuthAccessToken,
            state,
          );
        } catch (err) {
          console.error("Error logging in via connection", err);
          setError(err.message);
          return;
        }

        if (truffleAccessToken) {
          sendTruffleAccessTokenToOpener(truffleAccessToken);
        } else {
          setError("Missing access token");
        }
      } catch (err) {
        console.error("Error logging in", err);
        setError(err ?? "Error logging in");
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
        {error && <ErrorRenderer message={error} />}
      </div>
    </div>
  );
}

async function truffleConnectionLogin(
  oAuthAccessToken: string,
  state: string,
): Promise<string | null> {
  const { orgId, accessToken: truffleAccessToken, sourceType } =
    await decodeState(state) || {};

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

  if (result?.error) {
    const error = result.error?.graphQLErrors?.[0]?.extensions?.info;
    throw new Error(error);
  }

  return result?.data?.userLoginConnection?.accessToken;
}

export async function decodeState(state: string): Promise<DecodedAuth | null> {
  return state ? await verifyJWT(state) : null;
}

function sendTruffleAccessTokenToOpener(truffleAccessToken) {
  const payload = {
    type: MESSAGES.SET_ACCESS_TOKEN,
    truffleAccessToken,
  };

  // check if the oauth flow is being loaded in the ReactNative webview
  if (window?.ReactNativeWebView) {
    window.ReactNativeWebView?.postMessage(JSON.stringify(payload));
  }

  window.opener?.postMessage(JSON.stringify(payload), "*");
  const self = window.self;
  self.opener = window.self;
  self.close();
}
