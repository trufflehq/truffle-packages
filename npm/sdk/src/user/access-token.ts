import { jumper } from '../jumper/jumper-instance'

export async function getAccessToken (): Promise<string> {
  const token = await jumper.call('user.getAccessToken')
    // fall back to legacy storage key
    // TODO: rm this fallback after 4/2023
    || await jumper.call('storage.get', { key: 'mogul-menu:accessToken' });
  return token;
}

export async function setAccessToken ({ token, orgId }: { token: string, orgId?: string }) {
  return jumper.call('user.setAccessToken', { token, orgId });
}