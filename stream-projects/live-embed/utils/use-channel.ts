import { gql, useQuery } from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";

const CHANNEL_QUERY = gql`
  query ($input: ChannelInput) {
    channel(input: $input) {
      channelName, isLive
    }
  }
`;

export default function useIsLive({
  sourceType,
  sourceId,
  sourceName,
}: {
  sourceType: string;
  sourceId?: string;
  sourceName?: string;
}): { channelName: string; isLive: boolean } {
  const [{ data: channelData }] = useQuery({
    query: CHANNEL_QUERY,
    variables: { input: { sourceType, sourceId, sourceName } },
  });

  return channelData?.channel;
}
