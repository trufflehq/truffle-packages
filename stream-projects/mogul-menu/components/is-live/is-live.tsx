import { gql, React, useQuery } from "../../deps.ts";

const CHANNEL_QUERY = gql`
  query ($sourceType: String, $sourceId: String) {
    channel(input: { sourceType: $sourceType, sourceId: $sourceId }) {
      isLive
    }
  }
`;

export default function IsLive({
  sourceType,
  sourceId,
  children,
}: {
  sourceType: string;
  sourceId?: string;
  children?: any;
}) {
  const [{ data: channelData }] = useQuery({
    query: CHANNEL_QUERY,
    variables: { sourceType, sourceId },
  });

  const isLive = channelData?.channel?.isLive;

  if (!isLive) return <></>;
  else return <>{children}</>;
}
