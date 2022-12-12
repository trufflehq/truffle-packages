import { React, useState, gql, useQuery, useStyleSheet } from "../../deps.ts";
import AuthDialog from "https://tfl.dev/@truffle/ui@~0.1.0/components/auth-dialog/auth-dialog.tag.ts";

import styleSheet from "./user-info.css.js";

const USER_GET_ME_QUERY = gql`
  query {
    me {
      id
      name
    }
  }
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
        <button onClick={() => setIsAuthDialogHidden(false)}>Login</button>
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
