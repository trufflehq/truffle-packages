import { jumper, React } from "../../../deps.ts";
import { CRYSTAL_BALL_ICON, getPollInfo, MOGUL_MENU_JUMPER_MESSAGES } from "../../../shared/mod.ts";
import ChannelPointsIcon from "../../../components/channel-points-icon/channel-points-icon.tsx";
import ActivityBannerFragment, {
  ActivityBannerInfo,
  ActivityBannerSecondaryInfo,
  CloseActionIcon,
  ContinueActionIcon,
} from "../activity-banner-fragment/activity-banner-fragment.tsx";
import { Poll, PollOption } from "../../../types/mod.ts";

export default function PredictionBanner({ poll }: { poll: Poll }) {
  const {
    hasPollEnded: hasPredictionEnded,
    pollQuestion,
    winningOption,
    pollStartTime: predictionStartTime,
    pollEndTime: predictionEndTime,
    hasVoted,
    didWin,
    myWinningShare,
    myPlacedVotes,
  } = getPollInfo(
    poll,
  );

  const onContinue = () => {
    // emit a message through jumper to tell the  menu to open to the prediction page
    jumper.call("comms.postMessage", MOGUL_MENU_JUMPER_MESSAGES.OPEN_PREDICTION);
  };

  return (
    <ActivityBannerFragment
      title={hasPredictionEnded ? "Prediction ended" : "Current prediction"}
      startTime={predictionStartTime}
      endTime={predictionEndTime}
      color={"#AF7AF2"}
      icon={{
        path: CRYSTAL_BALL_ICON,
      }}
      action={hasPredictionEnded
        ? <CloseActionIcon />
        : <ContinueActionIcon onContinue={onContinue} />}
    >
      {!hasPredictionEnded
        ? <CurrentPrediction pollQuestion={pollQuestion} />
        : (winningOption && hasVoted)
        ? <PredictionEndedVoted amount={didWin ? myWinningShare : myPlacedVotes} didWin={didWin} />
        : <PredictionEndedNoVote pollQuestion={pollQuestion} winningOption={winningOption} />}
    </ActivityBannerFragment>
  );
}

function CurrentPrediction({ pollQuestion }: { pollQuestion: string }) {
  return <ActivityBannerInfo text={pollQuestion} />;
}

function PredictionEndedVoted(
  { amount, didWin = false }: { amount?: number; didWin?: boolean },
) {
  const message = didWin ? `You won` : `You lost`;
  // w/ live queries sometimes amount is NaN - haven't figure out yet.
  // also haven't figured out if it happens here or server-side
  // (i think server-side, which would mean str NaN)
  const isAmountNaN = typeof amount === "string" ? amount === "NaN" : isNaN(amount);
  return (
    <ActivityBannerInfo
      text={amount && isAmountNaN ? message : `${message} ${amount}`}
    >
      {amount ? <ChannelPointsIcon /> : null}
    </ActivityBannerInfo>
  );
}

function PredictionEndedNoVote(
  { pollQuestion, winningOption }: { pollQuestion: string; winningOption?: PollOption },
) {
  return (
    <ActivityBannerInfo text={pollQuestion}>
      {winningOption
        ? <ActivityBannerSecondaryInfo text={winningOption?.text} />
        : <ActivityBannerSecondaryInfo text={"Awaiting results"} />}
    </ActivityBannerInfo>
  );
}
