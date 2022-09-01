import React, { useState } from "https://npm.tfl.dev/react";
import AuthDialog from "https://tfl.dev/@truffle/ui@~0.1.0/components/auth-dialog/auth-dialog.tag.ts";
import Button from "https://tfl.dev/@truffle/ui@~0.1.0/components/button/button.tag.ts";
import { gql, useQuery } from "https://tfl.dev/@truffle/api@~0.1.0/client.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.4/format/wc/react/index.ts";

import styleSheet from "./user-info.css.js";

const USER_GET_ME_QUERY = gql`
  query { me { id, name } }
`;

export default function UserInfo() {
  useStyleSheet(styleSheet);
  const [meResult] = useQuery({ query: USER_GET_ME_QUERY });
  const [isAuthDialogHidden, setIsAuthDialogHidden] = useState(true);

  const { name, id } = meResult.data?.me || {};

  return (
    <div className="c-user-info">
      <h3>User info</h3>
      <div>ID: {id}</div>
      <div>Name: {name}</div>
      {!name && (
        <Button onClick={() => setIsAuthDialogHidden(false)}>Login</Button>
      )}
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
