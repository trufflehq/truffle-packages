import { createSubject } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'

const GRAPHQL_FIELDS = 'id, question, options { index, text, count, unique }, data, time, endTime, myVote { optionIndex, count }'
// don't need myVote when streaming in new poll (vote will be 0). this prevents a ton of queries if thousands are pubsubd
const STREAM_GRAPHQL_FIELDS = 'id, question, options { index, text, count, unique }, data, time, endTime'
// fields that get processed server-side once and pubsub'd
const PREPARE_GRAPHQL_FIELDS = 'id, question, options { index, text, count, unique }, data, time, endTime'

export default class Poll {
  constructor ({ auth }) {
    this.auth = auth
    this.clientChangesStream = createSubject(null)
  }

  // this is a temporary workaround since streaming currently requires
  // the request parameters to match. This lets us only fetch the latest poll
  // rather than the default 20 defined in zygote.
  // context: https://discord.com/channels/839188384752599071/845377383870890055/963515614771683338
  getAllSmall = ({ filterActive, limit = 1, isStreamed } = {}) => {
    return this.getAll({ filterActive, limit, isStreamed })
  }

  getAll = ({ filterActive, limit, isStreamed } = {}) => {
    const options = {
      isStreamed,
      clientChangesStream: this.clientChangesStream,
      shouldMergeStreamUpdates: true, // update doesn't send back myVote, but we want to keep it
      shouldPrependNewUpdates: true,
      ignoreIncrementsFromMe: true // don't double-count increments, since we handle them client-side
    }
    return this.auth.stream({
      query: `
        query ActivePolls($filterActive: Boolean, $limit: Int) {
          polls(filterActive: $filterActive, limit: $limit) {
            nodes { ${GRAPHQL_FIELDS} }
          }
        }`,
      streamOptions: isStreamed && {
        streamGraphQL: `{ ${STREAM_GRAPHQL_FIELDS} }`
      },
      variables: { filterActive, limit },
      pull: 'polls'
    }, options)
  }

  // getAll = () => {
  //   return this.auth.stream({
  //     query: `
  //       query PollsGetAll {
  //         polls {
  //           nodes { ${GRAPHQL_FIELDS} }
  //         }
  //       }`,
  //     // variables: {},
  //     pull: 'polls'
  //   })
  // }

  upsert = ({ id, question, options, durationSeconds }) => {
    return this.auth.call({
      query: `
        mutation PollUpsert(
          $id: ID
          $question: String
          $options: JSON
          $durationSeconds: Int
        ) {
          pollUpsert(id: $id, question: $question, options: $options, durationSeconds: $durationSeconds) {
            id
          }
        }
`,
      variables: { id, question, options, durationSeconds },
      streamOptions: {
        prepareGraphQL: `{ ${PREPARE_GRAPHQL_FIELDS} }`
      },
      pull: 'pollUpsert'
    }, { invalidateAll: true })
  }

  chooseWinningOptionIndexById = (id, { winningOptionIndex, isRefund } = {}) => {
    return this.auth.call({
      query: `
        mutation PollChooseWinningOptionIndexById($id: ID, $winningOptionIndex: Int, $isRefund: Boolean) {
          pollChooseWinningOptionIndexById(id: $id, winningOptionIndex: $winningOptionIndex, isRefund: $isRefund)
        }`,
      variables: { id, winningOptionIndex, isRefund },
      pull: 'pollChooseWinningOptionIndexById'
    }, { invalidateAll: true })
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation PollDeleteById($id: ID) {
          pollDeleteById(id: $id)
        }`,
      variables: { id },
      pull: 'pollDeleteById'
    }, { invalidateAll: true })
  }

  voteById = (id, optionIndex) => {
    this.clientChangesStream?.next({
      action: 'incrementChildren',
      oldId: id,
      childKey: 'options',
      children: [{ find: { index: optionIndex }, increment: { count: 1, unique: 1 } }]
    })
    this.clientChangesStream?.next({
      action: 'updateChild',
      oldId: id,
      childKey: 'myVote',
      newChildValue: { optionIndex }
    })
    return this.auth.call({
      query: `
        mutation PollVoteById(
          $id: ID!
          $optionIndex: Int!
        ) {
          pollVoteById(id: $id, optionIndex: $optionIndex)
        }
`,
      variables: { id, optionIndex },
      pull: 'pollVoteById'
    }) // don't invalidate, results streamed in
  }
}
