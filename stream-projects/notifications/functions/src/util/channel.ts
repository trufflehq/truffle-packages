import { gql, graphqlReq } from "./graphql-client.ts";

interface Channel {
  id: string;
  isLive: boolean;
  isManual: boolean;
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

const getChannel: (data: any) => Channel = (data: any) => data?.channel;

export async function fetchChannel(apiKey: string) {
  const resp = await graphqlReq(
    CHANNEL_QUERY,
    {},
    {
      apiKey,
    }
  ).then((result) => result.json());

  const channel = getChannel(resp?.data);
  return channel;
}
