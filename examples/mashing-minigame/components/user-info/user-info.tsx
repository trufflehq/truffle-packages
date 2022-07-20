import React, { useEffect, useState } from "https://npm.tfl.dev/react";
// import AuthDialog from "https://tfl.dev/@truffle/ui@~0.1.0/components/auth-dialog/auth-dialog.tag.ts";
import Button from "https://tfl.dev/@truffle/ui@~0.1.0/components/button/button.tag.ts";
import { gql, useQuery } from "https://tfl.dev/@truffle/api@~0.1.0/client.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts";
import styleSheet from "./user-info.scss.js";
const USER_GET_ME_QUERY = gql`
  query { me { id, name } }
`;

export default function UserInfo({ setActiveUser }) {
  const [meResult] = useQuery({ query: USER_GET_ME_QUERY });
  const [isAuthDialogHidden, setIsAuthDialogHidden] = useState(true);
  useStyleSheet(styleSheet);
  const { name } = meResult.data?.me || {};

  useEffect(() => {
    if (meResult.data?.me) {
      setActiveUser(meResult?.data?.me);
    }
  }, [JSON.stringify(meResult?.data)]);
  return (
    <>
      {name && <div>Name: {name}</div>}
      {!name && meResult?.data?.me && (
        <Button onClick={() => setIsAuthDialogHidden(false)}>Login</Button>
      )}
      {/* {!isAuthDialogHidden && (
        <AuthDialog
          hidden={isAuthDialogHidden}
          onclose={() => {
            setIsAuthDialogHidden(true);
          }}
        />
      )} */}
    </>
  );
}
