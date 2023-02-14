import { jumper } from '../jumper/jumper-instance';
import { createClient, gql } from '@urql/core';
import { DEFAULT_MYCELIUM_API_URL } from '../constants';

interface PageInfo {
  sourceType: string;
  sourceId: string;
}

interface ExtensionInfo {
  pageInfo: PageInfo[];
  platform: string;
  version: string;
}

const GET_ORG_BY_CHANNEL_QUERY = gql`
  query GetOrgByChannel($channelId: String!) {
    channel(input: { sourceType: "youtube", sourceId: $channelId }) {
      id
      sporeOrgId
    }
  }
`;

async function getYtChannelId() {
  const info = (await jumper.call('context.getInfo')) as ExtensionInfo;

  const [channelId] =
    info?.pageInfo
      ?.filter(({ sourceType }) => sourceType === 'youtube')
      ?.map(({ sourceId }) => sourceId) ?? [];

  return channelId;
}

export async function getOrgId(apiUrl?: string) {
  const channelId = await getYtChannelId();
  const gqlClient = createClient({ url: apiUrl ?? DEFAULT_MYCELIUM_API_URL });
  const { data } = await gqlClient
    .query(GET_ORG_BY_CHANNEL_QUERY, { channelId })
    .toPromise();
  const orgId = data?.channel?.sporeOrgId;

  return orgId;
}
