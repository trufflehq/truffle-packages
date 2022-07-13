import React, { useState } from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15.8.1";
import Stylesheet from "https://tfl.dev/@truffle/ui@~0.0.3/components/stylesheet/stylesheet.tag.ts";
import Button from "https://tfl.dev/@truffle/ui@~0.0.3/components/button/button.tag.ts"
import globalContext from "https://tfl.dev/@truffle/global-context@1.0.0/index.ts";
import { useQuery, gql } from "https://tfl.dev/@truffle/api@0.1.0/client.ts";


const ME_QUERY = gql`
  query {
    me {
      id
      avatarImage {
        cdn
        prefix
        ext
        variations {
          postfix
          width
          height
        }
        aspectRatio
      }
    }
  }
`;

const PACKAGE_POLL_QUERY =  gql`
  query PollConnectionQuery ($input: PollConnectionInput, $first: Int, $after: String, $last: Int, $before: String) {
    pollConnection(input: $input, first: $first, after: $after, last: $last, before: $before) {
        pageInfo {
            endCursor
            hasNextPage
            startCursor
            hasPreviousPage
        }
        nodes {
            id
            orgId
            question
            options {
                text
                index
                unique
            }
            time
        }
    }
}
`

type PollOption = {
  text: string
  index: number
  unique: number
}
type Poll = {
  id: string
  orgId: string
  question: string
  options: PollOption[]
  time: Date
}

type PollConnectionResponse = {
  pollConnection: {
    nodes: Poll[]
  }
}

export default function ActivePoll({ initialCount = 0 }) {
  console.log('ACTIVE POLL')
  const [count, setCount] = useState(initialCount);

  const [{ data: meData, fetching }] = useQuery({
    query: ME_QUERY,
  });

  const context = globalContext.getStore()

  const [{ data: pollConnectionData, fetching: pollFetching }] = useQuery({
    query: PACKAGE_POLL_QUERY, variables: {
      input: {
        packageId: context?.packageId
      },
      first: 1
    }
  });

  const pollConnection = (pollConnectionData as PollConnectionResponse)?.pollConnection

  const latestPoll = pollConnection?.nodes?.[0]

  console.log('meData', meData, fetching)
  // console.log('window._truffleInitialContext', window._truffleInitialContext)
  // console.log('globalContext', globalContext)
  console.log('pollConnection', pollConnection)
  console.log('latestPoll', latestPoll)

  console.log('context', context)
  const pollTitle = latestPoll?.question
  const pollOptions = latestPoll?.options
      
  return (
    <div className="c-active-poll">
      <Stylesheet url={new URL("./active-poll.css", import.meta.url)} />
      <div className="title">
        {pollTitle}
      </div>
      {pollOptions &&
        pollOptions.map((option) => {
           
          return <div className="option">
            {
              option?.text
            }
          </div>
        })
      }
    </div>
  );
}

ActivePoll.propTypes = {
  someProp: PropTypes.number,
};
