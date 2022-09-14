import { jumper, React, useEffect, useMutation, useStyleSheet, setCookie } from "../../deps.ts";
import ActivePoll from "../active-poll/active-poll.tsx";

import { MOGUL_TV_SIGNIN_MUTATION } from '../../gql/mod.ts'

import styleSheet from "./vote.scss.js";


function setAccessToken(accessToken?: string) {
  if (accessToken) {
    setCookie("accessToken", accessToken);
  }
}

function ExtensionMapping() {
  const [mogulResult, executeExtSignin] = useMutation(
    MOGUL_TV_SIGNIN_MUTATION,
  );

  useEffect(() => {
    const fetchCredentials = async () => {
      const credentials = await jumper.call("context.getCredentials");
      console.log("credentials", credentials);

      if (credentials?.sourceType === "youtube" && credentials?.token) {
        const mutationRes = await executeExtSignin({ token: credentials?.token }, {
          additionalTypenames: ["Poll", "PollVote", "PollOption", "MeUser"],
        });

        console.log("mutationRes", mutationRes);
        setAccessToken(mutationRes?.data?.mogulTvSignIn?.truffleAccessToken);
      }
    };

    fetchCredentials();
  }, []);
  useStyleSheet(styleSheet);

  return (
    <>
      <ActivePoll />
    </>
  );
}

export default ExtensionMapping;
