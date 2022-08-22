import { React, useStyleSheet } from '../../deps.ts'
import { Poll } from "../../types/poll.types.ts";
import { getHasPollEnded } from "../../utils/poll.utils.ts";
import ExternalLink from "../external-link/external-link.tsx";
import PollResultIndicatorIcon from "../poll-indicator-icon/poll-indicator-icon.tsx";

import styleSheet from "./poll-body.scss.js";

type PollBodyProps = {
  poll: Poll | undefined;
  pollEndTime?: Date;
  onToggle?: () => void
  isExpanded?: boolean
  children?: React.ReactNode;
  pollTitle?: React.ReactNode;
  shouldShowIndicator?: boolean
};

export default function PollBody(
  { poll, pollTitle, onToggle, isExpanded, children, shouldShowIndicator = true }: PollBodyProps,
) {
  useStyleSheet(styleSheet);

  const pollEndTime = poll?.endTime
  const hasPollEnded = getHasPollEnded(pollEndTime)

  return (
    <div className="c-poll-body">
      <header>
        <div className="title">
          <div className="question">{pollTitle ?? poll?.question}</div>
          { poll && shouldShowIndicator && <div className="icon">
            <PollResultIndicatorIcon poll={poll} />
          </div>}
        </div>
        {
          onToggle && 
          <div className="toggle" onClick={onToggle}>
            {
              isExpanded ? 'o' : 'c'
            }
          </div>
        }
      </header>
      <div className="body">
        {children}
      </div>
    </div>
  );
}
