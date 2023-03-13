import { embedConsumer } from '../transframe/embed-consumer';

export async function getAccessToken(apiUrl?: string): Promise<string> {
  // FIXME: This is a hack to wait for the embed transframe provider to initialize
  await new Promise((resolve) => setTimeout(resolve, 10));

  const token = (await embedConsumer.call('userGetAccessToken')) as string;
  return token;
}
