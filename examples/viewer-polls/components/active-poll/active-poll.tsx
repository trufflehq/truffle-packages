import React, { useState } from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15.8.1";
// import DateCountdown from "https://npm.tfl.dev/react-date-countdown-timer@1.1.0";
import Timer from "../timer/timer.tsx";
import classKebab from "https://tfl.dev/@truffle/utils@0.0.1/legacy/class-kebab.js";
import Stylesheet from "https://tfl.dev/@truffle/ui@~0.0.3/components/stylesheet/stylesheet.tag.ts";
import Button from "https://tfl.dev/@truffle/ui@~0.0.3/components/button/button.tag.ts";
import Radio from "https://tfl.dev/@truffle/ui@~0.0.4/components/radio/radio.tag.ts";
import { ME_QUERY, PACKAGE_POLL_QUERY, POLL_VOTE_MUTATION } from "./gql.ts";
import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";
import {
  gql,
  useMutation,
  useQuery,
} from "https://tfl.dev/@truffle/api@~0.1.0/client.ts";
import { PollConnectionResponse } from "./types.ts";

export default function ActivePoll({ initialCount = 0 }) {
  console.log("ACTIVE POLL");
  const [count, setCount] = useState(initialCount);
  const [selectedIndex, setSelectedIndex] = useState();
  const [{ data: meData, fetching }] = useQuery({
    query: ME_QUERY,
  });

  console.log('meData', meData)

  const [pollVoteResult, executeVoteMutation] = useMutation(
    POLL_VOTE_MUTATION,
  );
  const context = globalContext.getStore();

  const [{ data: pollConnectionData, fetching: pollFetching }] = useQuery({
    query: PACKAGE_POLL_QUERY,
    variables: {
      input: {
        packageId: context?.packageId,
      },
      first: 1,
    },
  });

  const pollConnection = (pollConnectionData as PollConnectionResponse)
    ?.pollConnection;
  const latestPoll = pollConnection?.nodes?.[0];

  console.log("latestPoll", latestPoll);

  const pollTitle = latestPoll?.question;
  const pollOptions = latestPoll?.options;
  const pollEndTime = latestPoll?.endTime;

  const start = new Date().getTime();
  const end = new Date(pollEndTime).getTime();
  const timeRemaining = (end - start) / 1000;
  console.log("pollEndTime", new Date(pollEndTime));

  const handleOptionSelection = (index) => {
    console.log("settign selected index", index);
    setSelectedIndex(index);
  };

  const handleVote = async () => {
    console.log("handling vote");
    const variables = {
      input: {
        id: latestPoll?.id,
        optionIndex: selectedIndex,
      },
    };

    console.log("variables", variables);

    await executeVoteMutation(variables, { additionalTypenames: ["Poll"] });
  };
  const isOptionSelected = !isNaN(selectedIndex);
  const isPollFetching = pollVoteResult?.fetching;
  const pollResultData = pollVoteResult?.data;
  const hasPollEnded = timeRemaining < 0
  const pollVoteError = pollVoteResult?.error?.graphQLErrors?.[0];
  console.log("isPollFetching", isPollFetching);
  console.log("pollResultData", pollVoteResult);
  return (
    <div className="c-active-poll">
      <Stylesheet url={new URL("./active-poll.css", import.meta.url)} />
      <div className="header">
        <div className="title">
          {pollTitle}
        </div>
        {pollEndTime && (
          <div className="countdown">
            <Timer initialSeconds={timeRemaining} />
          </div>
        )}
      </div>
      <div className="options">
        {pollOptions &&
          pollOptions.map((option) => {
            return (
              <div
                className={`option ${
                  classKebab({
                    isSelected: option.index === selectedIndex,
                  })
                }`}
                onClick={() => handleOptionSelection(option.index)}
              >
                {/* <Radio checked={true} /> */}
                {option?.text}
              </div>
            );
          })}
        {pollVoteError &&
          (
            <div className="error">
              {pollVoteError?.extensions?.info ?? "Error"}
            </div>
          )}
        {isOptionSelected && !hasPollEnded &&
          (
            <Button
              className="primary-button"
              onClick={handleVote}
              disabled={isPollFetching}
            >
              Vote
            </Button>
          )}
      </div>
    </div>
  );
}

ActivePoll.propTypes = {
  someProp: PropTypes.number,
};
