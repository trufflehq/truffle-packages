import React, { useState } from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15";
import AuthDialog from "https://tfl.dev/@truffle/ui@0.0.2/components/auth-dialog/auth-dialog.entry.js";
import Button from "https://tfl.dev/@truffle/ui@0.0.2/components/button/button.entry.js";
import Stylesheet from "https://tfl.dev/@truffle/ui@0.0.1/components/stylesheet/stylesheet.js";
import { gql, useQuery } from "https://tfl.dev/@truffle/api@0.0.1/client.js";

const USER_GET_ME_QUERY = gql`
  query { me { id, name } }
`

export default function UserInfo() {
  const [meResult, meReexecuteQuery] = useQuery({ query: USER_GET_ME_QUERY });
  const [isAuthDialogHidden, setIsAuthDialogHidden] = useState(true);

  console.log('me', meResult);

  return (
    <>
      <Stylesheet url={new URL("./user-info.css", import.meta.url)} />
      <h3>User info</h3>
      <div>ID: {meResult.data?.me?.id}</div>
      <div>Name: {meResult.data?.me?.name}</div>
      <Button onClick={() => setIsAuthDialogHidden(false)}>Login</Button>
      {!isAuthDialogHidden && <AuthDialog
        abc="123"
        hidden={isAuthDialogHidden}
        onClose={() => setIsAuthDialogHidden(true)}
      />}
    </>
  );
}

UserInfo.propTypes = {
  someProp: PropTypes.number,
};
