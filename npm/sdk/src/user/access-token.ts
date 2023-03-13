import { embedConsumer } from '../transframe/embed-consumer';

export async function getAccessToken(apiUrl?: string): Promise<string> {
  const token = (await embedConsumer.call('userGetAccessToken')) as string;
  return token;
}
