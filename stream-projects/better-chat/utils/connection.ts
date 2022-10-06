import { gql, query } from "https://tfl.dev/@truffle/api@~0.1.0/client.ts";
import LRU from "https://npm.tfl.dev/lru-cache@^6.0.0";
import PQueue from "https://npm.tfl.dev/p-queue@^7.3.0";

import { ConnectionWithExtras } from "./types.ts";

const GET_CONNECTION_QUERY = gql
  `query CacheableCollectiblesPowerupsConnectionBySourceAndSourceId ($input: ConnectionInput) {
  connection(input: $input) {
    id
    orgId
    userId
    sourceType
    sourceId
    orgUser {
      activePowerupConnection {
        totalCount
        nodes {
          id
          userId
          data {
            rgba
            value
          }
          powerup {
            id
            slug
            componentRels {
              props
            }
          }
        }
      }
    }
  }
}`;

const connectionCache = new LRU({
  // maximum of 2k entries in the cache
  max: 2000,
  // ttl of 1 min for each entry
  maxAge: 1000 * 60,
});
const asyncQueue = new PQueue({ concurrency: 1 });
const pendingConnectionFetches = new Map();

export async function getConnectionByYoutubeChannelId(
  youtubeChannelId: string,
): Promise<ConnectionWithExtras | null> {
  let connection = connectionCache.get(youtubeChannelId);

  if (connection === undefined) {
    if (pendingConnectionFetches.has(youtubeChannelId)) {
      connection = await pendingConnectionFetches.get(youtubeChannelId);
    } else {
      const connectionFetch = asyncQueue.add(() =>
        queryConnectionByYoutubeChannelId(youtubeChannelId)
      );
      pendingConnectionFetches.set(youtubeChannelId, connectionFetch);
      connection = await connectionFetch;
      // setting this author's connection to default to null
      // will prevent it from being requested again,
      // but will also prevent subsequent code from trying to use it
      connectionCache.set(youtubeChannelId, connection || null);
    }
  }

  return connection;
}

async function queryConnectionByYoutubeChannelId(
  youtubeChannelId: string,
): Promise<ConnectionWithExtras | null> {
  const res = await query(GET_CONNECTION_QUERY, {
    input: {
      sourceType: "youtube",
      sourceId: youtubeChannelId,
      // FIXME: rm. only want for dev, so i don't need to setup package in ludwig org
      orgId: "8e35b570-6c2f-11ec-bade-b32a8d305590",
    },
  });
  if (res?.errors) {
    console.error(res.errors);
    throw new Error(res.errors);
  }
  return res?.data?.connection;
}
