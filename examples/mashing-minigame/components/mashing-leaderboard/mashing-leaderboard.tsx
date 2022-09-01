import React, { memo } from "https://npm.tfl.dev/react";

import {
  OrgUserCounterType,
  OrgUserCounterTypeConnection,
  useIntervalFetchMashingLeaderboard,
} from "./hooks.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts";
import styleSheet from "./mashing-leaderboard.scss.js";
import { getMashTimeRemaining } from "../mash-controls/utils.ts";

type MashingLeaderboardProps = {
  endTime: Date;
  orgUserCounterTypeId: string;
};
export default function MashingLeaderboard(
  { endTime, orgUserCounterTypeId }: MashingLeaderboardProps,
) {
  const leaderboard = useIntervalFetchMashingLeaderboard(orgUserCounterTypeId);
  useStyleSheet(styleSheet);
  const timeRemaining = getMashTimeRemaining(endTime);
  const hasLeaderboard = leaderboard?.nodes?.length;

  return (
    <div className="c-mashing-leaderboard">
      {(!isNaN(timeRemaining) || hasLeaderboard) && <div className="title" />}
      <table>
        {!hasLeaderboard
          ? !isNaN(timeRemaining) && <EmptyState />
          : <LeaderboardRows leaderboard={leaderboard} />}
      </table>
    </div>
  );
}

function LeaderboardRows(
  { leaderboard }: { leaderboard: OrgUserCounterTypeConnection },
) {
  return (
    <>
      <thead>
        <tr className="row">
          <th className="rank">
            Rank
          </th>
          <th className="user">
            Username
          </th>
          <th className="count">
            Count
          </th>
        </tr>
      </thead>
      {leaderboard.nodes.map((row, i) => (
        <MemoizedRow key={row.userId} i={i} row={row} />
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <div className="empty">
      Waiting for players
    </div>
  );
}

type MemoizedRowProps = {
  row: OrgUserCounterType;
  i: number;
};
const MemoizedRow = memo(({ row, i }: MemoizedRowProps) => {
  return (
    <tr className="row">
      <td className="rank">
        {i + 1}
      </td>
      <td className="user">
        {row.user.name || "Anonymous"}
      </td>
      <td className="count">
        {row.count}
      </td>
    </tr>
  );
}, (prev: MemoizedRowProps, next: MemoizedRowProps) => {
  const isSameUserId = prev.row.userId === next.row.userId;
  const isSameCount = prev.row.count === next.row.count;
  const isSameIndex = prev.i === next.i;

  if (isSameCount && isSameUserId && isSameIndex) {
    return true;
  }

  return false;
});
