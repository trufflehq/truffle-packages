import { getEmbedConsumer } from './embed-consumer';

export async function getAccessToken(): Promise<string> {
  // TODO: support auth without extension
  const token = (await getEmbedConsumer().call('userGetAccessToken')) as string;
  return token;
}
