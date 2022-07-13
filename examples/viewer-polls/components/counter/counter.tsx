import React, { useState } from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15.8.1";
import Stylesheet from "https://tfl.dev/@truffle/ui@~0.0.3/components/stylesheet/stylesheet.tag.ts";
import Button from "https://tfl.dev/@truffle/ui@~0.0.3/components/button/button.tag.ts"
import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";
import { useQuery, gql } from "https://tfl.dev/@truffle/api@~0.1.0/client.ts";


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
            }
            time
        }
    }
}
`

export default function Counter({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);

  const [{ data: meData, fetching }] = useQuery({
    query: ME_QUERY,
  });

  const context = globalContext.getStore()

  const [{ data: pollConnection, fetching: pollFetching }] = useQuery({
    query: PACKAGE_POLL_QUERY, variables: {
      input: {
        packageId: context?.packageId
      }
    }
  });

  console.log('meData', meData, fetching)
  console.log('window._truffleInitialContext', window._truffleInitialContext)
  console.log('globalContext', globalContext)
  console.log('pollConnection', pollConnection)

  console.log('context', context)
  return (
    <>
      <Stylesheet url={new URL("./counter.css", import.meta.url)} />
      <div className="count">Count: {count}</div>
      <Button className="button" onClick={() => setCount(count + 1)}>
        Increment
      </Button>
    </>
  );
}

Counter.propTypes = {
  someProp: PropTypes.number,
};
