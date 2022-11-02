import { gql, GQLResponse, graphqlReq } from "./graphql-client.ts";

interface Channel {
  id: string;
  isLive: boolean;
  isManual: boolean;
}

interface ChannelResponse {
  channel: Channel;
}

const CHANNEL_QUERY = gql`
  query {
    channel(input: { sourceType: "youtube" }) {
      id
      isLive
      isManual
    }
  }
`;

const getChannel: (data: ChannelResponse) => Channel = (data) => data?.channel;

export async function fetchChannel(
  accessToken: string,
  orgId: string
): Promise<Channel> {
  // uncomment for testing
  // return {
  //   id: "someid",
  //   isLive: true,
  //   isManual: true,
  // };

  const resp = (await graphqlReq(
    CHANNEL_QUERY,
    {},
    {
      accessToken,
      orgId,
    }
  ).then((result) => result.json())) as GQLResponse<ChannelResponse>;

  const channel = getChannel(resp?.data);
  return channel;
}
