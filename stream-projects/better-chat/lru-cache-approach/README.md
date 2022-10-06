This approach has each new message execute a GraphQL request to get the
connection object for the author. And we cache the most recent 2,000 active
chatters in an LRU cache

This is better if done over WS (each message is lower overhead)

We could also prepopulate the cache with ActiveChatters list from
mycelium/youtube-api
