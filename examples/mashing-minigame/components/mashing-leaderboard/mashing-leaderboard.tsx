import React, { useEffect, useState } from "https://npm.tfl.dev/react";

import { useIntervalFetchMashingLeaderboard } from './hooks.ts'


type MashingLeaderboardProps = {
  orgUserCounterTypeId: string
}
export default function MashingLeaderboard({ orgUserCounterTypeId }: MashingLeaderboardProps) {
  const leaderboard = useIntervalFetchMashingLeaderboard(orgUserCounterTypeId)


  return <div className="c-mashing-leaderboard">
    {
      !leaderboard?.nodes?.length ?
        <div className="empty">
          Waiting for players
        </div>
      : leaderboard.nodes.map((row) => {
        return <div className="row">
          {`${row.userId}: ${row.count}`}
        </div>
      })
    }
  </div>
}