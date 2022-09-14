// this isn't an npm module, you need to install via apt or brew
// https://github.com/loadimpact/k6#install
// k6 run tests/load/test.js
import http from 'k6/http'
import { check } from 'k6'
import { Counter } from 'k6/metrics'

// grab from chrome dev tools
const POLL_ID = '8aecedb0-1e55-11ed-914c-30bac74e59c5'
const ORG_ID = '8e35b570-6c2f-11ec-bade-b32a8d305590'

// NOTE: this script will create a unique spore user (anonymous, but still in users_by_id)
// for each VU that gets created (thousands per script run)
const NUM_VUS = 500
const MAX_DURATION_SECONDS = 120

export const requests = new Counter('http_reqs')

export const options = {
  scenarios: {
    base: {
      executor: 'per-vu-iterations',
      vus: NUM_VUS,
      iterations: 1,
      maxDuration: `${MAX_DURATION_SECONDS}s`
    }
  },
  thresholds: {
    requests: ['count < 100']
  },
  userAgent: 'K6LoadTest'
}
export default function () {
  const cookies = {} // { key: val }
  const res = http.get('https://new.ludwig.social/song-suggestion/vote', { cookies: cookies })
  const vuJar = http.cookieJar()
  const cookiesForURL = vuJar.cookiesForURL(res.url)
  console.log('cookies', JSON.stringify(cookiesForURL, null, 2))
  const accessToken = cookiesForURL && cookiesForURL.accessToken && cookiesForURL.accessToken[0]
  check(res, {
    'status is 200': (r) => r.status === 200,
    'has accessToken': (r) => accessToken
  })

  let hasReceivedInitialResponse

  if (accessToken) {
    vote({ accessToken })
  }

  check(hasReceivedInitialResponse, {
    initial: (result) => result
  })
}

function vote ({ accessToken }) {
  const url = 'https://mycelium.truffle.vip/graphql'
  const vote = Math.round(Math.random())
  // grabbed from chrome dev tools
  const payloadStr = `{"query":"mutation PollVote($input: PollVoteByIdInput) {\\n  pollVoteById(input: $input) {\\n    hasVoted\\n    __typename\\n  }\\n}","operationName":"PollVote","variables":{"input":{"id":"${POLL_ID}","optionIndex": ${vote}}}}`

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': accessToken,
      'x-org-id': ORG_ID
    }
  }

  http.post(url, payloadStr, params)
}
