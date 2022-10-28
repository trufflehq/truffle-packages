import React, { useState } from "https://npm.tfl.dev/react";
import AuthDialog from "https://tfl.dev/@truffle/ui@~0.1.0/components/auth-dialog/auth-dialog.tag.ts";
import Button from "https://tfl.dev/@truffle/ui@~0.1.0/components/button/button.tag.ts";
import {
  gql,
  useQuery,
  useSubscription,
} from "https://tfl.dev/@truffle/api@~0.1.15/client.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import styleSheet from "./user-info.css.js";

const USER_GET_ME_QUERY = gql`
  query { me { id, name } }
`;

export default function UserInfo() {
  useStyleSheet(styleSheet);
  const [meResult] = useQuery({ query: USER_GET_ME_QUERY });
  const [isAuthDialogHidden, setIsAuthDialogHidden] = useState(true);
  const [subResult, reexecuteSubscription] = useSubscription({
    query: gql`subscription {
      alertConnection(input: { type: "activity" }, first: 2) {
        nodes {
          id
          message
          activity {
            __typename
            ... on Poll {
              id
              question
              options {
                  text
                  index
                  count
                  unique
              }
              myVote {
                optionIndex
                count
              }
            }
            ... on Alert {
              id
            }
          }
        }
      }
    }`,
  });
  const [subResult2, reexecuteSubscription2] = useSubscription({
    query: gql`subscription KOTHOrgQuery {
      org {
        name
        orgConfig {
          data
          __typename
        }
        __typename
      }
    }`,
  });
  console.log(
    "subscription example",
    JSON.stringify(subResult?.data, null, 2),
  );
  React.useEffect(() => {
    setTimeout(() => {
      console.log("reex");

      reexecuteSubscription();
    }, 5000);
  }, []);

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
