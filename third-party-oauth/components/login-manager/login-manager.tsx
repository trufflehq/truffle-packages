import {
  CombinedError,
  gql,
  mutation,
  React,
  setAccessToken,
  setOrgId,
  useEffect,
  useState,
  useStyleSheet,
} from "../../deps.ts";
import {
  closeSelf,
  DecodedAuth,
  postTruffleAccessTokenToNative,
  postTruffleAccessTokenToOpener,
  verifyJWT,
} from "../../shared/mod.ts";
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
  const [error, setError] = useState<{ title: string; message: string }>();

  useEffect(() => {
    oAuthAccessToken && state && (async () => {
      let truffleAccessToken;
      try {
        truffleAccessToken = await truffleConnectionLogin(
          oAuthAccessToken,
          state,
        );
      } catch (err) {
        console.error("Error logging in via connection", err);
        const parsedError = JSON.parse(err?.message || "{}");
        setError({ title: parsedError?.title, message: parsedError?.message });
        return;
      }

      try {
        if (truffleAccessToken) {
          sendTruffleAccessTokenToOpener(truffleAccessToken);
        } else {
          setError({ title: "Access error", message: "Missing access token" });
        }
      } catch (err) {
        console.error("Error sending token to opener", err);
        setError({ title: "Error", message: err ?? "Error logging in" });
      }
    })();
  }, [oAuthAccessToken, state]);

  return (
    <div className="c-login-manager">
      <div className="inner">
        {error ? <ErrorRenderer title={error.title} message={error.message} /> : <JetPackSnuffle />}
      </div>
    </div>
  );
}

export function JetPackSnuffle() {
  return (
    <div className="snuffle">
      <object
        data="https://cdn.bio/assets/images/landing/snuffle.svg?1"
        type="image/svg+xml"
      >
        <img src="https://cdn.bio/assets/images/landing/snuffle.svg?1" />
      </object>
    </div>
  );
}

const USER_CONNECTION_AUTH_ERR_CODE_TO_ERR: Record<
  number | string,
  { title: string; message: string }
> = {
  403: {
    title: "Access error",
    message: "You must grant Truffle access to read your YouTube account to continue.",
  },
  404: {
    title: "Youtube account error",
    message: "You'll need to create a Youtube channel to connect your account.",
  },
  undefined: {
    title: "Access error",
    message: "Unknown error",
  },
};

function getUserConnectionLoginError({ error }: { error: CombinedError }) {
  const code = error?.graphQLErrors?.[0]?.extensions?.code as number;

  return USER_CONNECTION_AUTH_ERR_CODE_TO_ERR[code];
}

async function truffleConnectionLogin(
  oAuthAccessToken: string,
  state: string,
): Promise<string | null> {
  const { orgId, accessToken: truffleAccessToken, sourceType } = await decodeState(state) || {};

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
    console.error("connection login error", result?.error);
    const error = getUserConnectionLoginError({ error: result?.error });
    throw new Error(JSON.stringify(error));
  }

  return result?.data?.userLoginConnection?.accessToken;
}

export async function decodeState(state: string): Promise<DecodedAuth | null> {
  return state ? await verifyJWT(state) : null;
}

export function sendTruffleAccessTokenToOpener(truffleAccessToken: string) {
  postTruffleAccessTokenToNative(truffleAccessToken);
  postTruffleAccessTokenToOpener(truffleAccessToken);
  closeSelf();
}
