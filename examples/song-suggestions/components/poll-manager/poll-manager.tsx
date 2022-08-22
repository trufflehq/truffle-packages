import { React, useState, useRef, useEffect, useMutation, Button, useStyleSheet } from '../../deps.ts'

import { RandomSubmissionProps } from '../admin/admin.tsx'
import PollBody from '../poll-body/poll-body.tsx'
import PollOptions from '../poll-options/poll-options.tsx'
import ProgressBar from '../progress-bar/progress-bar.tsx'
import YouTubeEmbed from '../youtube-embed/youtube-embed.tsx'
import ExternalLink from '../external-link/external-link.tsx'
import stylesheet from './poll-manager.scss.js'

import { ACTION_EXECUTE_MUTATION, POLL_UPSERT_MUTATION } from '../../gql/mod.ts'
import { getPollStartInput, fetchRandomSubmission, getPollEndInput } from '../../api/mod.ts'
import { useFetchPoll } from '../../hooks/mod.ts'
import { Poll, Submission } from "../../types/mod.ts";
import { getHasPollEnded } from "../../utils/mod.ts";
import UserChip from "../user-chip/user-chip.tsx";
import LoadingSpinner from "../loading-spinner/loading-spinner.tsx"

type PollManagerProps = {
  latestPoll: Poll | undefined
} & RandomSubmissionProps

export default function PollManager({ latestPoll, randomSubmission, setRandomSubmission }: PollManagerProps) {
  const lastPollRef = useRef(null);
  const [isStartingPoll, setIsStartingPoll] = useState(false);
  const [isEndingPoll, setIsEndingPoll] = useState(false);
  const [isGettingRandomPoll, setIsGettingRandomPoll] = useState(false)
  const [pollStartResult, executePollStartMutation] = useMutation(
    ACTION_EXECUTE_MUTATION,
  );
  const [pollEndResult, executePollEndMutation] = useMutation(
    POLL_UPSERT_MUTATION,
  );
  useStyleSheet(stylesheet)

  const hasChanged = lastPollRef.current?.id !== latestPoll?.id;

  useEffect(() => {
    if (latestPoll) {
      lastPollRef.current = latestPoll;
      setRandomSubmission(null);
      setIsStartingPoll(false);
    }
  }, [hasChanged]);

  const onRandom = async () => {
    try {
      setIsGettingRandomPoll(true)
      const submission = await fetchRandomSubmission();
      setRandomSubmission(submission);
      setIsGettingRandomPoll(false)
    } catch (e) {
      // e seems to be an empty object... so we just give a general error message
      alert('Oops! We couldn\'t select a submission. Make sure there\'s at least one approved submission.')
      setIsGettingRandomPoll(false)
    }

  };

  const onStart = async () => {
    if (randomSubmission?.id) {
      setIsStartingPoll(true);
      const input = getPollStartInput(randomSubmission.id);
      await executePollStartMutation(input);
    }
  };

  const onEnd = async () => {
    if (latestPoll?.id) {
      setIsEndingPoll(true);
      const input = getPollEndInput(latestPoll.id);
      await executePollEndMutation(input);
    }
  };

  const pollEndTime = latestPoll?.endTime;
  const hasPollEnded = getHasPollEnded(pollEndTime);

  useEffect(() => {
    if (hasPollEnded) {
      setIsEndingPoll(false);
    }
  }, [hasPollEnded]);

  const submission = randomSubmission || latestPoll?.data?.submission;
  const isRandomEnabled = hasPollEnded || !latestPoll;
  const isEndEnabled = !hasPollEnded && !isEndingPoll;
  const isStartEnabled = randomSubmission && !isStartingPoll;
  const shouldRenderPollPreview = latestPoll && (!hasPollEnded || !randomSubmission);

  return (
    <section className="c-poll-manager">
      <div className="inner">
        {shouldRenderPollPreview
          ? <PollWithPreview poll={latestPoll} submission={submission} />
          : randomSubmission
          ? <SubmissionPreview submission={randomSubmission} />
          : "Queue a random submission"}
        <div className="controls">
          {(isRandomEnabled)
            ? (!randomSubmission)
              ? (
                <Button
                  className="random button"
                  onClick={onRandom}
                  disabled={!isRandomEnabled}
                >
                   {isGettingRandomPoll ? <LoadingSpinner size={42} />: "Random"}
                </Button>
              )
              : (
                <>
                  <Button
                    className="back button"
                    onClick={() => setRandomSubmission(null)}
                    disabled={!isStartEnabled}
                  >
                    {"Back"}
                  </Button>
                  <Button
                    className="start button"
                    onClick={onStart}
                    disabled={!isStartEnabled}
                  >
                    {isStartingPoll ? <LoadingSpinner size={48} />: "Start Poll"}
                  </Button>
                </>
              )
            : (
              <Button
                className="end button"
                onClick={onEnd}
                disabled={!isEndEnabled}
              >
                {isEndingPoll ? <LoadingSpinner size={48} />: "End Poll"}
              </Button>
            )}
        </div>
      </div>
    </section>
  );
}

function PollWithPreview({ poll, submission }: { poll: Poll; submission: Submission }) {
  const pollOptions = poll?.options;

  return (
    <div className="c-poll-preview">
      <div className="poll">
        <div className="inner">
          <div className="body">
            <PollBody poll={poll}>
              <PollOptions
                isTransparent={true}
                pollOptions={pollOptions}
              />
            </PollBody>
          </div>
          <div className="progress">
            {/* {poll?.endTime && !hasPollEnded && <ProgressBar startDate={pollStartTime} endDate={pollEndTime} />} */}
          </div>
        </div>
      </div>

      {submission && (
        <div className="preview">
          <SubmissionPreview submission={submission} />
        </div>
      )}
    </div>
  );
}

function SubmissionPreview({ submission }: { submission: Submission }) {
  const username = submission?.channelTitle || submission?.username;
  return (
    <div className="c-submission-preview">
      <div className="embed">
        <YouTubeEmbed link={submission?.link} />
      </div>
      {submission?.title && <h3 className="title">{submission?.title}</h3>}
      <div className="credit">
        <div className="submitted-by-text">Submitted by</div>
        <div className="user-chip">
          <UserChip userId={submission?.userId} />
        </div>
      </div>
      <ExternalLink link={submission?.link} text={submission?.link} />
    </div>
  );
}
