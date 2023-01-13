import { jumper } from '../jumper/jumper-instance'

export async function getAccessToken (): Promise<string> {
  const token = await jumper.call('storage.get', { key: 'mogul-menu:accessToken' });
  return token;
}

export function setAccessToken (token: string) {

}