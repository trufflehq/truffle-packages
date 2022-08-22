import {
  Button,
  ChevronDownIcon,
  ChevronUpIcon,
  classKebab,
  jumper,
  React,
  useEffect,
  useMutation,
  useRef,
  useState,
  useStyleSheet,
} from "../../deps.ts";

import PollOptions from "../poll-options/poll-options.tsx";
import PollBody from "../poll-body/poll-body.tsx";
import Marquee from "../marquee/marquee.tsx";
import ExternalLink from "../external-link/external-link.tsx"
import ProgressBar from "../progress-bar/progress-bar.tsx";
import styleSheet from "./active-poll.scss.js";

import { POLL_VOTE_MUTATION } from "../../gql/mod.ts";
import { getHasPollEnded, getPollTimeRemaining } from "../../utils/mod.ts";
import { Poll } from "../../types/mod.ts";
import { useFetchPoll } from "../../hooks/mod.ts";

const POLL_SHOW_LAST_RESULTS_TIME_S = 20;

type ActivePollProps = {
  pollId?: string;
};

type ActivePollStyleVariants = "dismissed" | "collapsed" | "open-can-vote" | "open-vote-closed";

const BASE_IFRAME_STYLES = {
  height: "482px",
  width: "92%",
  background: "transparent",
  "z-index": 2000,
  position: "absolute",
  overflow: "hidden",
  transition: "clip-path .25s cubic-bezier(.4,.71,.18,.99)",
  left: "2%",
  right: "2%",
  top: "56px",
  "max-height": "none",
};

function getIframeStyles(variant: ActivePollStyleVariants) {
  const variantStyles = getVariantStyles(variant);

  return {
    ...BASE_IFRAME_STYLES,
    ...variantStyles,
  };
}

function getClipPath(yPx: number, roundPx = 10) {
  return `inset(0% 0% calc(100% - ${yPx}px) 0% round ${roundPx}px)`;
}

function getVariantStyles(variant: ActivePollStyleVariants) {
  switch (variant) {
    case "open-can-vote":
      return {
        "clip-path": getClipPath(198, 10),
      };
    case "open-vote-closed":
      return {
        "clip-path": getClipPath(164, 10),
      };
    case "dismissed":
      return {
        "clip-path": getClipPath(0, 0),
      };
    default:
      return {
        "clip-path": getClipPath(58, 10),
      };
  }
}

function handleCollapse(isCollapsed: boolean, isVotingEnabled: boolean) {
  const styles = getIframeStyles(isCollapsed ? "collapsed" : isVotingEnabled ? "open-can-vote" : "open-vote-closed");
  jumper.call("layout.applyLayoutConfigSteps", {
    layoutConfigSteps: [
      { action: "useSubject" }, // start with our iframe
      { action: "setStyle", value: styles },
    ],
  });
}

function handleDismiss() {
  const styles = getIframeStyles("dismissed");
  jumper.call("layout.applyLayoutConfigSteps", {
    layoutConfigSteps: [
      { action: "useSubject" }, // start with our iframe
      { action: "setStyle", value: styles },
    ],
  });
}

export default function ActivePoll({ pollId }: ActivePollProps) {
  const pollRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useStyleSheet(styleSheet);
  const latestPoll = useFetchPoll({ pollId, interval: 2000 });

  const hasPollEnded = getHasPollEnded(latestPoll?.endTime);
  const votedOption = latestPoll?.myVote?.optionIndex;
  const isVotingEnabled = Boolean(latestPoll && !hasPollEnded && typeof votedOption === "undefined");
  const hasPollChanged = pollRef.current?.id !== latestPoll?.id;

  const pollTimeRemaining = getPollTimeRemaining(latestPoll?.endTime);
  const isPollActive = pollTimeRemaining && pollTimeRemaining > (-1 * POLL_SHOW_LAST_RESULTS_TIME_S);

  useEffect(() => {
    if (isDismissed || !isPollActive) {
      handleDismiss();
    } else if (latestPoll?.endTime) {
      handleCollapse(isCollapsed, isVotingEnabled);
    }
  }, [isCollapsed, isVotingEnabled, isDismissed, isPollActive]);

  useEffect(() => {
    pollRef.current = latestPoll;
    setIsCollapsed(false);
    setIsDismissed(false);
  }, [hasPollChanged]);

  const onToggle = () => {
    setIsCollapsed((isCollapsed: boolean) => !isCollapsed);
  };

  return (
    <div className="c-active-poll">
      {isCollapsed
        ? (
          <CollapsedPoll
            isCollapsed={isCollapsed}
            onToggle={onToggle}
            poll={latestPoll}
          />
        )
        : (
          <ExpandedPoll
            isCollapsed={isCollapsed}
            onToggle={onToggle}
            poll={latestPoll}
            isVotingEnabled={isVotingEnabled}
          />
        )}
    </div>
  );
}

interface CollapsiblePollProps {
  onToggle: () => void;
  isCollapsed: boolean;
}

interface CollapsedPollProps extends CollapsiblePollProps {
  poll?: Poll;
}

function CollapsedPoll({ poll, isCollapsed, onToggle }: CollapsedPollProps) {
  const hasPollEnded = getHasPollEnded(poll?.endTime);
  const pollStartTime = poll?.time;
  const pollEndTime = poll?.endTime;
  return (
    <div className="c-collapsed-poll">
      <div className="inner">
        {poll?.endTime && (
          <Marquee
            gradient={false}
          >
            <div className={"title"}>
              {hasPollEnded ? "Poll Results" : "New Poll"}
            </div>
          </Marquee>
        )}
        <CollapseToggle isCollapsed={isCollapsed} onToggle={onToggle} />
      </div>
      {/* {poll?.endTime && !hasPollEnded && <ProgressBar startDate={pollStartTime} endDate={pollEndTime} />} */}
    </div>
  );
}

function CollapseToggle({ isCollapsed, onToggle }: CollapsiblePollProps) {
  return (
    <div className="c-collapsible-toggle" onClick={onToggle}>
      {isCollapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
    </div>
  );
}

interface ExpandedPollProps extends CollapsedPollProps {
  poll?: Poll;
  isVotingEnabled: boolean;
}

function ExpandedPoll({ poll, isVotingEnabled, isCollapsed, onToggle }: ExpandedPollProps) {
  const pollRef = useRef(null);

  const [selectedIndex, setSelectedIndex] = useState();
  const [pollVoteResult, executeVoteMutation] = useMutation(
    POLL_VOTE_MUTATION,
  );
  const handleOptionSelection = (index: number) => {
    setSelectedIndex(index);
  };

  const hasPollEnded = getHasPollEnded(poll?.endTime);

  useEffect(() => {
    const hasVoted = !!poll?.myVote && !isNaN(poll?.myVote?.optionIndex);
    const hasPollChanged = pollRef.current?.id !== poll?.id;

    if (hasVoted) {
      setSelectedIndex(poll?.myVote.optionIndex);
    } else if (hasPollEnded && !poll?.myVote?.optionIndex) {
      setSelectedIndex();
    } else if (hasPollChanged) {
      pollRef.current = poll;
      setSelectedIndex();
    }
  }, [poll]);

  const pollTitle = poll?.question;
  const pollOptions = poll?.options;
  const songLink = poll?.data?.submission?.link
  const songTitle = poll?.data?.submission?.title
  const pollStartTime = poll?.time;
  const pollEndTime = poll?.endTime;
  const pollVoteError = pollVoteResult?.error?.graphQLErrors?.[0];
  const isOptionSelected = !isNaN(selectedIndex);

  const handleVote = async () => {
    const variables = {
      input: {
        id: poll?.id,
        optionIndex: selectedIndex,
      },
    };

    await executeVoteMutation(variables, {
      additionalTypenames: ["Poll", "PollVote", "PollOption"],
    });
  };
 
  return (
    <div className="c-expanded-poll">
      <div className="inner">
        <PollBody
          poll={poll}
          shouldShowIndicator={false}
          pollTitle={
            <div className="header">
              <div className="info">
                <div className="title">
                  {pollTitle}
                </div>
                {
                  songLink && <ExternalLink link={songLink} text={songTitle || songLink || 'Song'} />
                }
              </div>
              <CollapseToggle isCollapsed={isCollapsed} onToggle={onToggle} />
            </div>
          }
        >
          <PollOptions
            pollOptions={pollOptions}
            selectedIndex={selectedIndex}
            isVotingEnabled={isVotingEnabled}
            handleOptionSelection={handleOptionSelection}
          />
          {pollVoteError && <PollVoteError poleVoteError={pollVoteError} />}
        </PollBody>
        {
          <footer
            className={classKebab({
              isVotingEnabled,
            })}
          >
            <PollVoteButton
              isVotingEnabled={isVotingEnabled}
              handleVote={handleVote}
              isOptionSelected={isOptionSelected}
            />
          </footer>
        }
      </div>
      {/* {poll?.endTime && !hasPollEnded && <ProgressBar startDate={pollStartTime} endDate={pollEndTime} />} */}
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

function PollVoteError({ poleVoteError }: { poleVoteError: any}) {
  return (
    <div className="error">
      {poleVoteError?.extensions?.info ?? "Error"}
    </div>
  );
}
