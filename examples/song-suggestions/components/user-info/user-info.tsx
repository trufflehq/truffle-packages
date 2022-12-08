import React, { useEffect, useState } from "https://npm.tfl.dev/react";
import AuthDialog from "https://tfl.dev/@truffle/ui@~0.1.0/components/auth-dialog/auth-dialog.tag.ts";
import Button from "https://tfl.dev/@truffle/ui@~0.1.0/components/button/button.tag.ts";
import { gql, useQuery } from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import { setCookie } from "https://tfl.dev/@truffle/utils@~0.0.2/cookie/cookie.ts";
import styleSheet from "./user-info.scss.js";
const USER_GET_ME_QUERY = gql`
  query { 
    me { 
      id
      name
    }
    orgUser {
      id
      roleConnection {
        nodes {
          id
          name
          slug
          rank
        }
      }
    }
  }
`;

function setAccessToken(accessToken?: string) {
  if (accessToken) {
    setCookie("accessToken", accessToken);
  }
}
export default function UserInfo({ setActiveUser, setActiveOrgUser }) {
  const [meResult] = useQuery({ query: USER_GET_ME_QUERY });
  const [isAuthDialogHidden, setIsAuthDialogHidden] = useState(true);
  useStyleSheet(styleSheet);
  const { name } = meResult.data?.me || {};

  console.log("meResult.data", meResult.data);
  useEffect(() => {
    if (meResult.data?.me) {
      setActiveUser(meResult?.data?.me);
    }

    if (setActiveOrgUser && meResult.data?.orgUser) {
      setActiveOrgUser(meResult.data?.orgUser);
    }
  }, [JSON.stringify(meResult?.data)]);
  return (
    <div className="c-user-info">
      {!name && meResult?.data?.me
        ? (
          <Button
            className="button"
            onClick={() => setIsAuthDialogHidden(false)}
          >
            Login
          </Button>
        )
        : null}
      {!isAuthDialogHidden && (
        <AuthDialog
          hidden={isAuthDialogHidden}
          onclose={() => {
            setIsAuthDialogHidden(true);
          }}
        />
      )}
    </div>
  );
}
