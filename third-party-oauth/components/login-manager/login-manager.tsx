import { gql, jose, React, useEffect, useMutation, useState, useStyleSheet } from "../../deps.ts";
import {
  MESSAGES,
  OAuthSourceType,
  setAccessToken,
  setGlobalStoreOrgId,
  verifyJWT,
} from "../../shared/mod.ts";
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
  mutation LoginQuery ($sourceType: String, $accessToken: String) {
    connectionLogin(input: { sourceType: $sourceType, accessToken: $accessToken}) {
      accessToken
      userName
    }
  }
`;

async function getUser(truffleAccessToken: string, orgId: string) {
  // const apiUrl = window?._truffleInitialData?.clientConfig?.IS_PROD_ENV
  //   ? "https://mycelium.truffle.vip/graphql"
  //   : "http://localhost:50420/graphql";
  const apiUrl = "https://mycelium.truffle.vip/graphql"
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "x-access-token": truffleAccessToken,
      "x-org-id": orgId,
    },
    body: JSON.stringify({
      query: `  query {
        me {
          id
          name
          email
          phone
        }
      }`,
    }),
  });

  const data = await res.json();

  return data?.data?.me;
}

interface DecodedAuth extends jose.JWTPayload {
  accessToken?: string;
  orgId?: string;
  sourceType?: OAuthSourceType;
}

export default function LoginManager(
  { ytAccessToken, state }: {
    ytAccessToken?: string;
    state?: string;
  },
) {
  useStyleSheet(stylesheet);
  const [connectionAccessToken, setConnectionAccessToken] = useState<string>();
  const [loginResult, executeLogin] = useMutation(LOGIN_MUTATION);
  const [user, setUser] = useState();
  const [sourceType, setSourceType] = useState<OAuthSourceType>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    setConnectionAccessToken(ytAccessToken);
  }, [ytAccessToken]);

  useEffect(() => {
    const getPayload = async () => {
      const decodedState: DecodedAuth | null = state ? await verifyJWT(state) : null;
      const decodedTruffleAccessToken = decodedState?.accessToken;
      const decodedOrgId = decodedState?.orgId;
      const decodedSourceType = decodedState?.sourceType;

      if (decodedTruffleAccessToken && decodedOrgId && decodedSourceType && !user) {
        setGlobalStoreOrgId(decodedOrgId);
        setAccessToken(decodedTruffleAccessToken);
        setSourceType(decodedSourceType);

        const rawUser = await getUser(decodedTruffleAccessToken, decodedOrgId);
        setUser(rawUser);
      }
    };
    getPayload();
  }, []);

  useEffect(() => {
    const login = async () => {
      if (user && sourceType && connectionAccessToken) {
        const result = await executeLogin({
          sourceType,
          accessToken: connectionAccessToken,
        });

        const truffleAccessToken = result?.data?.connectionLogin?.accessToken;
        const userName = result?.data?.connectionLogin?.userName;
        if (truffleAccessToken) {
          const payload = {
            type: MESSAGES.SET_ACCESS_TOKEN,
            truffleAccessToken,
            userName,
          };

          try {
            window.opener?.postMessage(JSON.stringify(payload), "*");
            const self = window.self;
            self.opener = window.self;
            self.close();
          } catch (err) {
            setError("Error logging in");
          }
        } else {
          // show an error
          setError("Error logging in");
        }
      }
    };
    login();
  }, [JSON.stringify(user), sourceType]);

  return (
    <div className="c-login-manager">
      <div className="inner">
        <div className="snuffle">
          <object data="https://cdn.bio/assets/images/landing/snuffle.svg?1" type="image/svg+xml">
            <img src="https://cdn.bio/assets/images/landing/snuffle.svg?1" />
          </object>
        </div>
        {error && (
          <div className="error">
          </div>
        )}
      </div>
    </div>
  );
}
