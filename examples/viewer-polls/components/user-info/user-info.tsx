import React, { useEffect, useState } from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15";
import AuthDialog from "https://tfl.dev/@truffle/ui@~0.0.3/components/auth-dialog/auth-dialog.tag.ts";
import Button from "https://tfl.dev/@truffle/ui@~0.0.3/components/button/button.tag.ts";
import Stylesheet from "https://tfl.dev/@truffle/ui@~0.0.3/components/stylesheet/stylesheet.tag.ts";
import { gql, useQuery } from "https://tfl.dev/@truffle/api@~0.1.0/client.ts";

const USER_GET_ME_QUERY = gql`
  query { me { id, name } }
`;

export default function UserInfo({ setActiveUser }) {
  const [meResult] = useQuery({ query: USER_GET_ME_QUERY });
  const [isAuthDialogHidden, setIsAuthDialogHidden] = useState(true);

  const { name } = meResult.data?.me || {};

  useEffect(() => {
    if (meResult.data?.me) {
      setActiveUser(meResult?.data?.me);
    }
  }, [JSON.stringify(meResult?.data)]);
  return (
    <>
      <Stylesheet url={new URL("./user-info.css", import.meta.url)} />
      {name && <div>Name: {name}</div>}
      {!name && meResult?.data?.me && (
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
    </>
  );
}
