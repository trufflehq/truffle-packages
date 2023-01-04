import { gql, useQuery } from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";

const CHANNEL_QUERY = gql`
  query ($sourceType: String, $sourceId: String) {
    channel(input: { sourceType: $sourceType, sourceId: $sourceId }) {
      isLive
    }
  }
`;

export default function useIsLive({
  sourceType,
  sourceId,
}: {
  sourceType: string;
  sourceId?: string;
}) {
  const [{ data: channelData, error }] = useQuery({
    query: CHANNEL_QUERY,
    variables: { sourceType, sourceId },
  });

  console.log("cd", channelData, error);

  const isLive = channelData?.channel?.isLive;
  return true; // FIXME isLive;
}
