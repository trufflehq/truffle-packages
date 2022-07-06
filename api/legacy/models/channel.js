/**
 * NOTE: this is a temporary hack to grab channel isLive status from the youtube-api
 * and twitch-api. Eventually we will move to a model where we enable/disable directly
 * via the EconomyAction.
 */
export default class Channel {
  constructor ({ auth }) {
    this.auth = auth
  }

  getBySource = ({ sourceType, sourceId, ignoreCache }) => {
    return this.auth.stream({
      query: `
      query Channel($sourceType: String, $sourceId: String) {
        channel(sourceType: $sourceType, sourceId: $sourceId) {
          id
          sporeOrgId
          channelName
          isLive
          isManual
          sourceType
        }
      }`,
      variables: { sourceType, sourceId },
      pull: 'channel'
    }, { ignoreCache })
  }

  getByMe = ({ ignoreCache }) => {
    return this.auth.stream({
      query: `
      query Channel{
        channel {
          id
          sporeOrgId
          channelName
          isLive
          isManual
          sourceType
        }
      }`,
      pull: 'channel'
    }, { ignoreCache })
  }

  upsert = ({ sourceType, isLive, isManual }) => {
    return this.auth.call({
      query: `
      mutation ChannelUpsert($sourceType: String, $isLive: Boolean, $isManual: Boolean) {
        channelUpsert(sourceType: $sourceType, isLive: $isLive, isManual: $isManual) {
          id
          isLive
          isManual
        }
      }
      `,
      variables: {
        sourceType,
        isLive,
        isManual
      },
      pull: 'channelUpsert'
    }, { invalidateAll: true })
  }
}
