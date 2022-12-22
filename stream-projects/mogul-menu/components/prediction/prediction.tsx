import {
  _,
  abbreviateNumber,
  classKebab,
  Computed,
  formatPercentage,
  Icon,
  Memo,
  Observable,
  ObservableObject,
  React,
  useMutation,
  useObserve,
  useSelector,
  useSignal,
  useStyleSheet,
} from "../../deps.ts";
import { VOTE_MUTATION } from "./gql.ts";
import { COIN_ICON_PATH, getOptionColor, useInterval } from "../../shared/mod.ts";
import { Poll, PollOption } from "../../types/mod.ts";
import Time from "../time/time.tsx";
import Input from "../base/input/input.tsx";
import Button from "../base/button/button.tsx";
import styleSheet from "./prediction.scss.js";

const ACTIVE_POLL_INTERVAL = 1000;
const INACTIVE_POLL_INTERVAL = 60000;

interface VoteInput {
  // amount of channel points user has typed in to vote
  amount: string;
  // which option the user has selected to vote for
  index: number;
}

// winning info
export function getWinningInfo({ prediction$ }: { prediction$: Observable<Poll> }) {
  const winningOptionIndex = prediction$.data?.winningOptionIndex?.get();
  const winningOption = winningOptionIndex !== undefined
    ? prediction$.counter.options.get()?.[winningOptionIndex]
    : undefined;

  const winningVotes = winningOptionIndex !== undefined
    ? prediction$.counter.options.get()?.[winningOptionIndex]?.count || 1
    : undefined;
  const numWinningVoters = winningOptionIndex !== undefined
    ? prediction$.counter.options.get()?.[winningOptionIndex]?.unique ?? 0
    : 0;

  return { winningOptionIndex, winningOption, winningVotes, numWinningVoters };
}

// total number of votes info
export function getTotalVotes({ prediction$ }: { prediction$: Observable<Poll> }) {
  return { totalVotes: _.sumBy(prediction$.counter?.options.get() ?? [], "count") };
}

// myVote info
function getMyVoteInfo({ prediction$ }: { prediction$: Observable<Poll> }) {
  const { winningOptionIndex, winningVotes } = getWinningInfo({ prediction$ });
  const { totalVotes } = getTotalVotes({ prediction$ });

  const myVote = prediction$.myVote?.get();
  const votedOptionIndex = myVote?.optionIndex;
  const isWinner = votedOptionIndex === winningOptionIndex;
  const myVotes = myVote?.count || 0;
  const winnings = isWinner && winningVotes ? Math.floor((myVotes / winningVotes) * totalVotes) : 0;
  const hasSelectedWinningOption = winningOptionIndex === votedOptionIndex;

  return { votedOptionIndex, isWinner, myVotes, winnings, hasSelectedWinningOption };
}

// prediction refund info
export function getIsRefund({ prediction$ }: { prediction$: Observable<Poll> }) {
  return { isRefund: prediction$.data.isRefund?.get() ?? false };
}

// prediction time info
export function getTimeInfo({ prediction$ }: { prediction$: Observable<Poll> }) {
  const pollMsLeft = new Date(prediction$.endTime.get() || Date.now()).getTime() -
    Date.now();

  const hasPredictionEnded = pollMsLeft <= 0;
  const endTime = prediction$.endTime.get();
  const winnerSelectedTime = prediction$.data?.winnerSelectedTime?.get();
  const timeSinceWinnerSelection = winnerSelectedTime
    ? new Date(winnerSelectedTime).getTime() - Date.now()
    : undefined;
  return { pollMsLeft, hasPredictionEnded, endTime, timeSinceWinnerSelection };
}

// gets all the info we need to render the prediction
function getPredictionInfo({ prediction$ }: { prediction$: Observable<Poll> }) {
  const { winningOption, numWinningVoters } = getWinningInfo({ prediction$ });
  const { totalVotes } = getTotalVotes({ prediction$ });
  const { winnings, hasSelectedWinningOption } = getMyVoteInfo({ prediction$ });
  const { isRefund } = getIsRefund({ prediction$ });
  const { pollMsLeft, hasPredictionEnded, endTime } = getTimeInfo({ prediction$ });

  return {
    hasPredictionEnded,
    isRefund,
    winningOption,
    winnings,
    pollMsLeft,
    numWinningVoters,
    totalVotes,
    hasSelectedWinningOption,
    endTime,
  };
}

export default function Prediction(
  { prediction$ }: { prediction$: Observable<Poll> },
) {
  useStyleSheet(styleSheet);
  const [, executeVoteMutation] = useMutation(VOTE_MUTATION);

  // used to keep track of what the user has typed in to vote
  const currVote$ = useSignal<VoteInput>({
    amount: "",
    index: -1,
  });
  const error$ = useSignal("");

  useObserve(() => {
    // if the user has already cast a vote, limit them from voting on other options
    if (prediction$.myVote?.get()) {
      currVote$.index.set(prediction$.myVote?.get()?.optionIndex!);
    }
  });

  const pollQuestion = useSelector(() => prediction$.question.get());

  const vote = async () => {
    try {
      error$.set("");
      // cast vote
      await executeVoteMutation({
        voteCount: -1 * parseInt(currVote$.amount.get()),
        additionalData: {
          optionIndex: currVote$.index.get(),
          pollId: prediction$.id.get(),
        },
      },
      { additionalTypenames: ["OrgUserCounter"] });

      // reset the current vote amount and limit them from voting on other options
      currVote$.set({ amount: "", index: currVote$.index.get() });
    } catch (err) {
      error$.set(err.message);
    }
  };

  return (
    <div className="c-prediction">
      <div className="question-banner">
        <div className="question">{pollQuestion}</div>
        <Memo>
          {() => <PredictionStatus prediction$={prediction$} />}
        </Memo>
        <Memo>
          {() => <PredictionResults prediction$={prediction$} />}
        </Memo>
      </div>
      <PredictionOptions prediction$={prediction$} currVote$={currVote$} vote={vote} />
    </div>
  );
}

function PredictionStatus({ prediction$ }: { prediction$: Observable<Poll> }) {
  const { hasPredictionEnded, isRefund, winningOption } = useSelector(() =>
    getPredictionInfo({
      prediction$,
    })
  );

  // need to set the interval here because we need to update the timer every second when the prediction is still active
  const pollMsLeft$ = useSignal(0);
  useObserve(() => {
    const pollMsLeft = new Date(prediction$.endTime.get() || Date.now()).getTime() -
      Date.now();
    pollMsLeft$.set(pollMsLeft);
  });
  useInterval(() => {
    const pollMsLeft = new Date(prediction$.endTime.get() || Date.now()).getTime() -
      Date.now();
    pollMsLeft$.set(pollMsLeft);
  }, !hasPredictionEnded ? ACTIVE_POLL_INTERVAL : INACTIVE_POLL_INTERVAL);
  const pollMsLeft = useSelector(() => pollMsLeft$.get());

  return (
    <div className="status">
      {(hasPredictionEnded && isRefund) ? <div>Prediction canceled</div> : null}
      {(hasPredictionEnded && !isRefund && !winningOption)
        ? <div>Submissions closed, waiting on result</div>
        : null}
      {(hasPredictionEnded && winningOption)
        ? (
          <div className="winner" style={{ color: getOptionColor(winningOption.index) }}>
            {winningOption.text}
          </div>
        )
        : null}
      {(!hasPredictionEnded && !isRefund)
        ? (
          <div>
            <span>
              Submissions closing in <Time ms={pollMsLeft} />
            </span>
          </div>
        )
        : null}
    </div>
  );
}

function PredictionResults({ prediction$ }: { prediction$: Observable<Poll> }) {
  const { winningOption, numWinningVoters } = useSelector(() => getWinningInfo({ prediction$ }));
  const { hasSelectedWinningOption, winnings } = useSelector(() => getMyVoteInfo({ prediction$ }));
  const { isRefund } = useSelector(() => getIsRefund({ prediction$ }));
  const { totalVotes } = useSelector(() => getTotalVotes({ prediction$ }));

  return winningOption
    ? hasSelectedWinningOption
      ? (
        <PredictionResult
          title="You won!"
          channelPointsAmount={winnings}
          message={numWinningVoters > 1
            ? `go to you and ${numWinningVoters - 1} others`
            : `go to you`}
        />
      )
      : (
        <PredictionResult
          title="Better luck next time"
          channelPointsAmount={totalVotes}
          message={`go to ${numWinningVoters} others`}
        />
      )
    : isRefund
    ? (
      <PredictionResult
        title="Prediction cancelled"
        channelPointsAmount={prediction$.myVote?.get()?.count || 0}
        message="refunded to your account"
      />
    )
    : null;
}

function PredictionResult(
  { title, channelPointsAmount, message }: {
    title: string;
    channelPointsAmount?: number;
    message: string;
  },
) {
  return (
    <div className="c-prediction-result">
      <div className="title">
        {title}
      </div>
      <div className="message">
        {channelPointsAmount
          ? (
            <>
              <div className="amount">
                {channelPointsAmount} <ChannelPointsCoinIcon />
              </div>
              {message}
            </>
          )
          : null}
      </div>
    </div>
  );
}

function PredictionOptions(
  { prediction$, currVote$, vote }: {
    prediction$: Observable<Poll>;
    vote: () => void;
    currVote$: Observable<VoteInput>;
  },
) {
  return (
    <Memo>
      {() => (
        <div className="options">
          {prediction$.counter.options.map((option$) => {
            return (
              <PredictionOption
                prediction$={prediction$}
                option$={option$}
                currVote$={currVote$}
                vote={vote}
              />
            );
          })}
        </div>
      )}
    </Memo>
  );
}

function PredictionOption(
  { prediction$, option$, currVote$, vote }: {
    prediction$: Observable<Poll>;
    option$: ObservableObject<PollOption>;
    currVote$: Observable<{ index: number; amount: string }>;
    vote: () => void;
  },
) {
  const { hasPredictionEnded } = useSelector(() => getTimeInfo({ prediction$ }));
  const { totalVotes } = useSelector(() => getTotalVotes({ prediction$ }));

  const count = option$.count.get() || 0;
  const ratio = count && totalVotes - count
    ? Math.round(100 * (1 + (totalVotes - count) / count)) / 100
    : 1;

  const hasVotedOnOtherOption = useSelector(() => {
    const votedOptionIndex = prediction$.myVote?.get()?.optionIndex;

    return votedOptionIndex !== undefined && votedOptionIndex !== option$.index.get();
  });

  const isVotedOption = useSelector(() => {
    return prediction$.myVote?.get()?.optionIndex === option$.index.get();
  });

  return (
    <div
      className="c-prediction-option"
      style={{
        "--option-color": getOptionColor(option$.index.get()),
      } as React.CSSProperties}
    >
      <div className="name">
        {option$.text.get()}
      </div>
      <div className="tile">
        <div className="stats">
          <div className="percentage">
            <div>
              {totalVotes ? formatPercentage((option$.count.get() || 0) / totalVotes) : "0%"}
            </div>
          </div>
          <PollOptionStat label="total points">
            {abbreviateNumber(option$.count.get() || 0, 0)}
          </PollOptionStat>
          <PollOptionStat label="return ratio">
            1 : {ratio}
          </PollOptionStat>
          <PollOptionStat label="total voters">
            {abbreviateNumber(option$.unique.get() || 0, 0)}
          </PollOptionStat>
        </div>
      </div>
      <div className="input">
        <Computed>
          {() => (
            <VoteAmountInput
              index={option$.index.get()}
              currVote$={currVote$}
              isDisabled={hasVotedOnOtherOption || hasPredictionEnded}
              onClick={vote}
            />
          )}
        </Computed>
      </div>
      {prediction$.myVote?.get() && isVotedOption && (
        <div className="my-vote">
          {`${abbreviateNumber(prediction$.myVote?.get()?.count, 0)} channel points spent`}
        </div>
      )}
    </div>
  );
}

function PollOptionStat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <div className="value">{children}</div>
      <div className="label">{label}</div>
    </>
  );
}

function VoteAmountInput(
  { index, currVote$, isDisabled, ...props }: {
    index: number;
    currVote$: Observable<{ index: number; amount: string }>;
    isDisabled: boolean;
    onClick: () => void;
  },
) {
  // the amount the user types in
  const optionAmount$ = useSignal("");
  const error$ = useSignal("");

  useObserve(() => {
    if (parseInt(optionAmount$.get()) < 0) {
      error$.set("Amount must be positive");
    } else {
      error$.set("");
    }
  });

  useObserve(() => {
    // reset the amount if the user changes their vote
    const currentVoteIndex = currVote$.index.get();
    if (currentVoteIndex !== index) {
      optionAmount$.set("");
    }
  });

  useObserve(() => {
    // when the reactive amount changes, update the currVote$ observable
    // with the amount the user would like to vote
    const optionAmount = optionAmount$.get();
    if (optionAmount) {
      currVote$.set({
        index,
        amount: optionAmount$.get(),
      });
    }
  });

  const optionAmount = useSelector(() => optionAmount$.get());
  const isActive = useSelector(() => !!optionAmount || currVote$.index.get() === index);

  const onClick = async () => {
    await props.onClick();
    optionAmount$.set("");
  };
  return (
    <>
      <div
        className={`c-vote-amount-input ${classKebab({ isDisabled: isDisabled })}`}
        style={{
          "--border-color": optionAmount ? getOptionColor(index) : "var(--mm-color-bg-tertiary)",
        } as React.CSSProperties}
      >
        <ChannelPointsCoinIcon />
        <Input
          type="number"
          disabled={isDisabled}
          value$={optionAmount$}
          error$={error$}
        />
        <Button
          className={`vote-button ${
            classKebab({
              isActive,
            })
          }`}
          onClick={onClick}
          style="bg-tertiary"
          isDisabled={!optionAmount || parseInt(optionAmount) <= 0}
          shouldHandleLoading
          css={{
            // override border color in the button component
            "--border-color": isActive ? getOptionColor(index) : "var(--mm-color-bg-tertiary)",
          } as React.CSSProperties}
        >
          Vote
        </Button>
      </div>
      {error$.get() && <div className="error">{error$.get()}</div>}
    </>
  );
}

function ChannelPointsCoinIcon() {
  return (
    <div className="c-channel-points-icon">
      <Icon icon={COIN_ICON_PATH} color="#EBC564" />
    </div>
  );
}
