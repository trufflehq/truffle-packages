import {
  gql,
  React,
  useStyleSheet,
  usePollingQuery,
  useEffect,
  useMutation,
useState
} from '../../deps.ts'

import styleSheet from './move-poll.css.js'

type Option = {
  index: number;
  text: string;
  count: number;
}

type PollVote = {
  pollId: string;
  userId: string;
  optionIndex: number;
  count: number;
}

type Poll = {
  id: string;
  orgId: string;
  endTime: string;
  options: Option[];
  myVote: PollVote;
}

const POLL_INTERVAL = 1000
const CURRENT_POLL_QUERY = gql`
  query GetCurrentPoll {
    pollConnection(first: 1) {
      nodes {
        id
        orgId
        endTime
        options {
          index
          text
          count
        }
        myVote {
          optionIndex
        }
      }
    }
  }
`

const VOTE_MUTATION = gql`
  mutation PollVote($input: PollVoteByIdInput!) {
  pollVoteById(input: $input) {
    hasVoted
  }
}
`

export default function MovePoll() {
  useStyleSheet(styleSheet)

  const { data: pollData } = usePollingQuery(POLL_INTERVAL, { query: CURRENT_POLL_QUERY })

  const poll: Poll = pollData?.pollConnection?.nodes?.[0]
  const timeLeft = new Date(poll?.endTime ?? 0).getTime() - Date.now() 
  const isPollExpired = timeLeft < 0
  const statusMessage = isPollExpired ? 'Waiting for streamer\'s move' : `Accepting votes :${Math.floor(timeLeft/1000)}`
  const totalVotes = poll?.options?.reduce((sum, option) => sum + option.count, 0)
  const pollId = poll?.id
  const winningOptionIdx =
    isPollExpired &&
    poll?.options?.reduce(
      (winningOption, option) => 
        option.count > winningOption.count 
          ? option
          : winningOption,
      { index: -1, count: 0 } 
    ).index

  const [selectedOptionIdx, setSelectedOption] = useState(null)


  const [_voteResult, executeVoteMutation] = useMutation(VOTE_MUTATION)

  const optionClickHandler = async (option: Option) => {
    // don't let the user vote if they've already voted
    // or if the poll expired
    if (selectedOptionIdx !== null || isPollExpired) return

    setSelectedOption(option.index)
    await executeVoteMutation({
      input: {
        id: pollId,
        optionIndex: option.index
      }
    })
  }

  // when the pollId changes, that means a new poll has been created
  // and we want to reset the selection
  useEffect(() => {
    // by default, we want to grab the selection from
    // the db (in case they refreshed their browser)
    setSelectedOption(poll?.myVote?.optionIndex ?? null)
  }, [pollId])

  if (!pollData) return <>Loading...</>

  return (
    <div className="c-move-poll">
      <div className="status-message">{statusMessage}</div>
      <div className="options">
        {
          poll?.options?.map((option, idx) => 
            <OptionEl
              option={option}
              totalVotes={totalVotes}
              isClickable={!isPollExpired && selectedOptionIdx === null}
              isSelected={selectedOptionIdx === idx}
              isWinning={winningOptionIdx === idx}
              onClick={() => optionClickHandler(option)}
            />
          )
        }
      </div>
    </div>
  )
}

function OptionEl(
  {
    option,
    totalVotes,
    isClickable,
    isSelected,
    isWinning,
    onClick
  }:
  {
    option: Option,
    totalVotes: number,
    isClickable?: boolean,
    isSelected?: boolean,
    isWinning?: boolean,
    onClick?: Function
  }) {
  const percentFill = option.count / totalVotes * 100

  let borderColor = 'gray'
  if (isWinning) borderColor = 'red'
  else if (isSelected) borderColor = 'green'

  return (
    <div
      className={`option ${isClickable && 'is-clickable'}`}
      style={{
        '--border-color': borderColor
      }}
      onClick={onClick}
    >
      <div
        className="progress-fill"
        style={{
          width: `${percentFill}%`
        }}
      />
      <div className="text">{option.text}</div>
      <div className="vote-count">{option.count} votes</div>
    </div>
  )
}