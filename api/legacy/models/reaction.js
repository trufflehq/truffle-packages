export default class Reaction {
  constructor ({ auth, chatMessage }) {
    this.auth = auth
    this.chatMessage = chatMessage
  }

  upsertByParent = async ({ topType, topId, parentType, parentId }, { sourceType, sourceId, vote }) => {
    let clientIncrement
    if (parentType === 'chatMessage') {
      clientIncrement = vote || -1
      this.chatMessage.clientChangesStreamObj[topId]?.next({
        action: 'incrementChildren',
        oldId: parentId,
        childKey: 'reactionCounts',
        children: [{ find: { sourceType, sourceId }, increment: { count: clientIncrement } }]
      })
      this.chatMessage.clientChangesStreamObj[topId]?.next({
        action: 'updateChildren',
        oldId: parentId,
        childKey: 'myReactions',
        children: [{ find: { sourceType, sourceId }, replace: { vote: vote } }]
      })
    }

    try {
      const res = await this.auth.call({
        query: `
          mutation ReactionUpsert(
            $topType: String
            $topId: ID
            $parentType: String!
            $parentId: ID!
            $sourceType: String!
            $sourceId: String!
            $vote: Int!
          ) {
            reactionUpsert(
              topType: $topType
              topId: $topId
              parentType: $parentType
              parentId: $parentId
              sourceType: $sourceType
              sourceId: $sourceId
              vote: $vote
            ) {
              sourceType
              sourceId
              vote
            }
          }
`,
        variables: { topType, topId, parentType, parentId, sourceType, sourceId, vote },
        pull: 'reactionUpsert'
      }, { invalidateAll: parentType !== 'chatMessage' }) // don't invalidate, it'll be streamed back
      return res
    } catch (err) {
      // undo the  vote
      if (parentType === 'chatMessage') {
        this.chatMessage.clientChangesStreamObj[topId]?.next({
          action: 'incrementChildren',
          oldId: parentId,
          childKey: 'reactionCounts',
          children: [{ find: { sourceType, sourceId }, increment: { count: -1 * clientIncrement } }]
        })
      }
      throw err
    }
  }
}
