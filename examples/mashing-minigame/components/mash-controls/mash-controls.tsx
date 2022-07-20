import React, { useEffect, useState } from "https://npm.tfl.dev/react";
import { useMutation } from "https://tfl.dev/@truffle/api@~0.1.0/client.ts";
import { ACTION_EXECUTE_MUTATION, getRemoteIncrementInput } from '../../api/gql.ts'
import Timer from "../timer/timer.tsx";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts";
import styleSheet from "./mash-controls.scss.js";
import Button from "https://tfl.dev/@truffle/ui@~0.1.0/components/button/button.tag.ts";
import { getMashTimeRemaining } from "./utils.ts";
import { useIntervalFetchMashingConfig, useIntervalFetchOrgUserCounter } from "./hooks.ts";
import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";

export default function MashControls() {
  const [mashCount, setMashCount] = useState(0);
  const [_a, executeActionMutation] = useMutation(
    ACTION_EXECUTE_MUTATION,
  );
  const context = globalContext.getStore();
  useStyleSheet(styleSheet);

  const roundConfig = useIntervalFetchMashingConfig();


  const ouc = useIntervalFetchOrgUserCounter(roundConfig.orgUserCounterTypeId)
  const endTime = roundConfig?.endTime;
  const count = parseInt(ouc?.count)
  const rank = parseInt(ouc?.rank)

  useEffect(() => {
    if(!isNaN(count) && mashCount < count) {
      setMashCount(count)
    }
  }, [count])

  useEffect(() => {
    setMashCount(0);
  }, [endTime]);

  const incrementRemote = async () => {
    const input = getRemoteIncrementInput(context.orgId)
    const { data, error } = await executeActionMutation(input);
    // FIXME
    if (error) {
      alert(error);
    }

  };
  const timeRemaining = getMashTimeRemaining(roundConfig?.endTime);
  const hasRoundEnded = timeRemaining < 0;


  const handleMash = async () => {
    if(!hasRoundEnded) {
      setMashCount((prevMashCount: number) => prevMashCount + 1);
      await incrementRemote()
    }
  };

  return (
    <div className="c-mash-controls">
      <div className="status">
        {!hasRoundEnded && <Timer className="info" endTime={roundConfig?.endTime} />}
        <div className="stats">
          <div className="info">
            {`Count: ${mashCount}`}
          </div>
          {!isNaN(rank) && <div className="info">
            {`Rank: ${rank}`}
          </div>}
        </div>
      </div>
      <div className='button-wrapper'>
        <Button className="mash-button" disabled={hasRoundEnded} onMouseUp={handleMash}>
          MASH
        </Button>
      </div>
    </div>
  );
}
