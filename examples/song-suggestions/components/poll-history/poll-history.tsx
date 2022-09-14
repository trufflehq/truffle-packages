import { React, useState, useEffect, useStyleSheet } from '../../deps.ts'

import PollBody from '../poll-body/poll-body.tsx'
import PollOptions from '../poll-options/poll-options.tsx'
import PollResultIndicatorIcon from '../poll-indicator-icon/poll-indicator-icon.tsx'
import LoadingSpinner from '../loading-spinner/loading-spinner.tsx'
import ExternalLink from '../external-link/external-link.tsx'
import stylesheet from './poll-history.scss.js'
import { useFetchPollHistory } from '../../hooks/mod.ts'
import UserChip from '../user-chip/user-chip.tsx'

export default function PollHistory() {
  const [isInitializingPolls, setIsInitializingPolls] = useState(true)
  
  const polls = useFetchPollHistory();

  useEffect(() => {
    if(polls?.length) {
      setIsInitializingPolls(false)
    }

  }, [JSON.stringify(polls)])

  useStyleSheet(stylesheet)

  return (
    <div className="c-poll-history">
      {
        !polls && <div className="empty">
          <LoadingSpinner size={100} />
        </div>
      }
      {polls && polls.map((poll) => {
        
        const songUrl = poll?.data?.submission?.link;
        const songTitle = poll?.data?.submission?.title
        const pollOptions = poll?.options;
        const userId = poll?.data?.submission?.userId;

        return (
          <div className="poll">
            <PollBody
              poll={poll}
              pollTitle={<ExternalLink link={songUrl} text={songTitle || songUrl || "Song"} />}
            >
              <div className="info">
                <div className="user">
                  <ExternalLink
                    link={`http://www.youtube.com/channel/${poll.data.submission.connectionId}`} 
                    text={<UserChip userId={userId} />}
                  />
                </div>
              </div>
              <PollOptions
                isTransparent={true}
                pollOptions={pollOptions}
              />
            </PollBody>
          </div>
        );
      })}
    </div>
  );
}