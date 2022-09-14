export type ConnectionType = 'youtube'

export type Connection = {
  id: string
  sourceType: string
  sourceId: string
  data: Record<string,unknown>
  orgUser: {
    name?: string
    user: {
      name?: string
    }
  }
}

export type YouTubeConnectionQueryResponse = {
  data: {
    connection: Connection
  }
}
