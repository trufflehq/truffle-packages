import {
  jumper,
  React,
  useEffect,
  useMutation,
  useObserve,
  useSelector,
  useSignal,
  useStyleSheet,
  useSubscriptionSignal,
} from "../../deps.ts";
import {
  CRYSTAL_BALL_ICON,
  CRYSTAL_BALL_ICON_VIEWBOX,
  DELETE_POLL_MUTATION,
  hasPermission,
  MOGUL_MENU_JUMPER_MESSAGES,
  ONE_SECOND_MS,
  OrgUserQuerySignal,
  useInterval,
} from "../../shared/mod.ts";
import { getEmbed } from "https://npm.tfl.dev/@trufflehq/sdk@0.3.2"; // TODO: deps file
import { usePageStack } from "../page-stack/mod.ts";
import { useDialog } from "../base/dialog-container/dialog-service.ts";
import DeleteDialog from "../delete-dialog/delete-dialog.tsx";
import PredictionPage from "../prediction-page/prediction-page.tsx";
import { POLL_CONNECTION_SUBSCRIPTION } from "../prediction/gql.ts";
import { useCurrentTab } from "../tabs/mod.ts";
import { useMenu } from "../menu/mod.ts";
import Tile, { RemoveButton } from "../tile/tile.tsx";
import Time from "../time/time.tsx";
import { getTimeInfo, getWinningInfo } from "../prediction/prediction.tsx";
import styleSheet from "./prediction-tile.scss.js";

const embed = getEmbed();

const PASSIVE_POLL_INTERVAL = 60 * ONE_SECOND_MS;
const RESULTS_TIMOUT = 100 * ONE_SECOND_MS;
// NOTE: we don't currently have a way to clean up onMessage listeners
// in the extension so we'll need to be cognizant that the prediction tile
// component will be mounted for the lifetime of the embed
// listens for messages through jumper to open the prediction page
function useListenForOpenPrediction(showPredictionPage: () => void) {
  useEffect(() => {
    jumper.call("comms.onMessage", (message: string) => {
      if (message === MOGUL_MENU_JUMPER_MESSAGES.OPEN_PREDICTION) {
        showPredictionPage();
      }
    });
  }, []);
}

export default function PredictionTile(
  { orgUser$ }: { orgUser$: OrgUserQuerySignal },
) {
  useStyleSheet(styleSheet);
  const { isActive } = useCurrentTab();
  const { setIsOpen } = useMenu();
  const { pushPage } = usePageStack();
  const { pushDialog, popDialog } = useDialog();
  const [_deletePollResult, executeDeletePollResult] = useMutation(
    DELETE_POLL_MUTATION,
  );
  const { signal$: predictionConnection$ } = useSubscriptionSignal(
    POLL_CONNECTION_SUBSCRIPTION,
  );

  const prediction$ = predictionConnection$.data.pollConnection.nodes[0];

  const hasPollDeletePermission = useSelector(() =>
    hasPermission({
      orgUser: orgUser$.orgUser.get!(),
      actions: ["delete"],
      filters: {
        poll: { isAll: true, rank: 0 },
      },
    })
  );

  const onDeletePrediction = async () => {
    await executeDeletePollResult({ id: prediction$.id.get() });
    popDialog();
  };

  const onDelete = () => {
    pushDialog(
      <DeleteDialog
        title="Are you sure you want to delete this prediction?"
        onDelete={onDeletePrediction}
      />,
    );
  };

  const { hasPredictionEnded, timeSinceWinnerSelection } = getTimeInfo({
    prediction$,
  });
  const { winningOption } = getWinningInfo({ prediction$ });
  const hasResultsExpired = useSelector(() =>
    Boolean(winningOption) && timeSinceWinnerSelection
      ? RESULTS_TIMOUT + timeSinceWinnerSelection < 0
      : false
  );

  // need to set the interval here because we need to update the timer every second when the prediction is still active
  const pollMsLeft$ = useSignal(0);
  useObserve(() => {
    const pollMsLeft =
      new Date(prediction$.endTime.get() || Date.now()).getTime() -
      Date.now();
    pollMsLeft$.set(pollMsLeft);
  });

  useInterval(() => {
    const pollMsLeft =
      new Date(prediction$.endTime.get() || Date.now()).getTime() -
      Date.now();

    pollMsLeft$.set(pollMsLeft);
  }, isActive ? ONE_SECOND_MS : PASSIVE_POLL_INTERVAL);

  const pollMsLeft = useSelector(() => pollMsLeft$.get());

  let Content: React.ReactNode;

  if (hasResultsExpired) {
    Content = (
      <div className="content">
        <div className="primary-text">
          No current prediction
        </div>
      </div>
    );
  } else if (hasPredictionEnded && winningOption) {
    Content = (
      <div className="content">
        <div className="primary-text">{prediction$.question.get()}</div>
        <div className="secondary-text">The results are in!</div>
      </div>
    );
  } else if (hasPredictionEnded) {
    Content = (
      <div className="content">
        <div className="primary-text">{prediction$.question.get()}</div>
        <div className="secondary-text">Submissions closed</div>
      </div>
    );
  } else {
    Content = (
      <div className="content">
        <div className="primary-text">{prediction$.question.get()}</div>
        <div className="secondary-text">
          <span>
            Submissions closing in <Time ms={pollMsLeft} />
          </span>
        </div>
      </div>
    );
  }

  // useListenForOpenPrediction(showPredictionPage);

  const prediction = prediction$.get();
    
  useEffect(() => {
    if (prediction?.id && !hasPredictionEnded) {
      embed.showToast({
        title: "New prediction!",
        body: prediction.question,
        onClick: () => {
          embed.openWindow();
        }
      });
    }
  }, [prediction?.id]);

  if (!prediction$.get()) return <></>;

  return (
    <Tile
      className="c-prediction-tile"
      icon={CRYSTAL_BALL_ICON}
      iconViewBox={CRYSTAL_BALL_ICON_VIEWBOX}
      headerText="Prediction"
      color="#AB8FE9"
      shouldHandleLoading={true}
      removeTooltip="Delete"
      onClick={hasResultsExpired ? null : () => pushPage(<PredictionPage />)}
      content={() => Content}
      action={hasPollDeletePermission && !hasResultsExpired &&
        (
          <RemoveButton
            onRemove={onDelete}
            shouldHandleLoading={true}
            removeTooltip="Delete"
          />
        )}
    />
  );
}
