import React, { useEffect, useState } from "https://npm.tfl.dev/react";
import {
  useMutation,
  useQuery,
} from "https://tfl.dev/@truffle/api@~0.1.1/client.ts";
import {
  ACTION_EXECUTE_MUTATION,
  getRemoteIncrementInput,
  MASHING_RANK_QUERY,
} from "../../api/gql.ts";
import Timer from "../timer/timer.tsx";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.5/format/wc/react/index.ts";
import styleSheet from "./mash-controls.scss.js";
import Button from "https://tfl.dev/@truffle/ui@~0.1.0/components/button/button.tag.ts";
import { getMashTimeRemaining } from "./utils.ts";
import {
  useIntervalFetchMashingConfig,
  useIntervalFetchOrgUserCounter,
} from "./hooks.ts";
import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";
import UserInfo from "../user-info/user-info.tsx";

export default function MashControls() {
  const [activeUser, setActiveUser] = useState();
  const [mashCount, setMashCount] = useState(0);
  const [_a, executeActionMutation] = useMutation(
    ACTION_EXECUTE_MUTATION,
  );
  const roundConfig = useIntervalFetchMashingConfig();

  const [{ data: userRank }, executeQuery] = useQuery({
    query: MASHING_RANK_QUERY,
    variables: {
      input: {
        id: roundConfig.orgUserCounterTypeId,
      },
    },
  });
  const context = globalContext.getStore();
  useStyleSheet(styleSheet);

  const ouc = useIntervalFetchOrgUserCounter(roundConfig.orgUserCounterTypeId);
  const endTime = roundConfig?.endTime;
  const count = parseInt(ouc?.count);
  const rank = parseInt(ouc?.rank);

  useEffect(() => {
    if (!isNaN(count) && mashCount < count) {
      setMashCount(count);
    }
  }, [count]);

  useEffect(() => {
    setMashCount(0);
  }, [endTime]);

  const incrementRemote = async () => {
    const input = getRemoteIncrementInput(context.orgId);
    const { data, error } = await executeActionMutation(input);
    if (error) {
      console.error(error);
    }
  };
  const timeRemaining = getMashTimeRemaining(endTime);
  const hasRoundEnded = timeRemaining < 0;

  const handleMash = async () => {
    if (!hasRoundEnded) {
      setMashCount((prevMashCount: number) => prevMashCount + 1);
      await incrementRemote();
    }
  };

  useEffect(() => {
    if (hasRoundEnded) {
      const ouc = userRank?.orgUserCounterType?.orgUserCounter;
      const count = parseInt(ouc?.count);
      if (count) {
        setMashCount(count);
      }
    }
  }, [JSON.stringify(userRank), hasRoundEnded]);

  const onEnd = async () => {
    // fetch final count
    await executeQuery({ requestPolicy: "network-only" });
  };

  return (
    <div className="c-mash-controls">
      <div className="status">
        {
          <Timer
            className="info clock"
            endTime={endTime}
            onEnd={onEnd}
            empyStateText={"Round over"}
          />
        }
        <div className="stats">
          {hasRoundEnded && (
            <div className="info">
              {`Count: ${mashCount}`}
            </div>
          )}
          {!isNaN(rank) && (
            <div className="info">
              {`Rank: ${rank}`}
            </div>
          )}
        </div>
      </div>
      <div className="button-wrapper">
        <Button
          className="mash-button"
          disabled={hasRoundEnded}
          onMouseUp={handleMash}
        >
        </Button>
        {!activeUser?.name && <UserInfo setActiveUser={setActiveUser} />}
      </div>
    </div>
  );
}
