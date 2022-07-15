import React, { useEffect, useRef, useState } from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15.8.1";
import Stylesheet from "https://tfl.dev/@truffle/ui@~0.0.3/components/stylesheet/stylesheet.tag.ts";
import Button from "https://tfl.dev/@truffle/ui@~0.0.3/components/button/button.tag.ts";
import { POLL_VOTE_MUTATION } from "../gql.ts";
import { getPollTimeRemaining } from "../utils.ts";
import PollOptions from "../poll-options/poll-options.tsx";
import PollBody from "../poll-body/poll-body.tsx";
import { useMutation } from "https://tfl.dev/@truffle/api@~0.1.0/client.ts";

import { useFetchPoll } from "../hooks.ts";
type ActivePollProps = {
  pollId?: string;
};

export default function ActivePoll({ pollId }: ActivePollProps) {
  const [selectedIndex, setSelectedIndex] = useState();
  const latestPollRef = useRef(null);

  const [pollVoteResult, executeVoteMutation] = useMutation(
    POLL_VOTE_MUTATION,
  );

  const latestPoll = useFetchPoll({ pollId });

  const pollTitle = latestPoll?.question;
  const pollOptions = latestPoll?.options;
  const pollEndTime = latestPoll?.endTime;
  const timeRemaining = getPollTimeRemaining(pollEndTime);
  const hasPollEnded = timeRemaining < 0;

  useEffect(() => {
    if (!isNaN(latestPoll?.myVote?.optionIndex)) {
      setSelectedIndex(latestPoll?.myVote.optionIndex);
    } else if (hasPollEnded && !latestPoll?.myVote?.optionIndex) {
      setSelectedIndex();
    } else if (latestPollRef.current?.id !== latestPoll?.id) {
      latestPollRef.current = latestPoll;
      setSelectedIndex();
    }
  }, [latestPoll]);

  const handleOptionSelection = (index) => {
    console.log("handle option select");
    setSelectedIndex(index);
  };

  console.log(selectedIndex);

  const handleVote = async () => {
    const variables = {
      input: {
        id: latestPoll?.id,
        optionIndex: selectedIndex,
      },
    };

    await executeVoteMutation(variables, {
      additionalTypenames: ["Poll", "PollVote", "PollOption"],
    });
  };

  const pollVoteError = pollVoteResult?.error?.graphQLErrors?.[0];
  const votedOption = latestPoll?.myVote?.optionIndex;
  const isVotingEnabled = latestPoll && !hasPollEnded && isNaN(votedOption);
  const isOptionSelected = !isNaN(selectedIndex);

  return (
    <div className="c-active-poll">
      <Stylesheet url={new URL("./active-poll.css", import.meta.url)} />
      <PollBody pollTitle={pollTitle} pollEndTime={pollEndTime}>
        <PollOptions
          pollOptions={pollOptions}
          selectedIndex={selectedIndex}
          isVotingEnabled={isVotingEnabled}
          handleOptionSelection={handleOptionSelection}
        />
        {pollVoteError && <PollVoteError poleVoteError={pollVoteError} />}
      </PollBody>
      <footer>
        <PollVoteButton
          isVotingEnabled={isVotingEnabled}
          handleVote={handleVote}
          isOptionSelected={isOptionSelected}
        />
      </footer>
    </div>
  );
}

type PollVoteButtonProps = {
  isVotingEnabled: boolean;
  handleVote: () => void;
  isOptionSelected: boolean;
};

function PollVoteButton(
  { isVotingEnabled, handleVote, isOptionSelected }: PollVoteButtonProps,
) {
  return (
    isVotingEnabled
      ? (
        <Button
          className="primary-button"
          onClick={handleVote}
          disabled={!isOptionSelected}
        >
          Vote
        </Button>
      )
      : null
  );
}

function PollVoteError({ poleVoteError }) {
  return (
    <div className="error">
      {poleVoteError?.extensions?.info ?? "Error"}
    </div>
  );
}

ActivePoll.propTypes = {
  someProp: PropTypes.number,
};
