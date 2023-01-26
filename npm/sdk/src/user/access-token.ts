import { jumper } from '../jumper/jumper-instance'
import { createClient } from '@urql/core'
import { DEFAULT_MYCELIUM_API_URL } from '../constants';
import { USER_LOGIN_ANON } from './gql';

let anonToken: string | null = null;
export async function getAccessToken (apiUrl?: string): Promise<string> {
  let token = await jumper.call('user.getAccessToken')
    // fall back to legacy storage key
    // TODO: rm this fallback after 4/2023
    || await jumper.call('storage.get', { key: 'mogul-menu:accessToken' });
  
  // sign them in as an anonymous user if they don't have a token
  // console.log('yep, this is the new version', token)
  if (!token) {
    // console.log('no token, so getting the new access token!!!')
    if (anonToken === "loading") {
      // console.log('waiting for the new access token!!!')
      while (anonToken === "loading") {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      token = anonToken;
      // console.log('got the new access token after waiting', token)
    } else if (anonToken) {
      // console.log('got the new access token from anonToken', anonToken)
      token = anonToken;
    } else {
      anonToken = "loading";
      // console.log('getting the new access token!!!')
      const gqlClient = createClient({ url: apiUrl ?? DEFAULT_MYCELIUM_API_URL });
      const { data } = await gqlClient.mutation(USER_LOGIN_ANON, {}).toPromise();
      token = data?.userLoginAnon?.accessToken;
      anonToken = token;
      await setAccessToken({ token })
    }

    // console.log('got the new access token', token)
  }

  return token;
}

export async function setAccessToken ({ token, orgId }: { token: string, orgId?: string }) {
  return Promise.all([
    jumper.call('user.setAccessToken', { token, orgId }),

    // fall back to legacy storage key
    // TODO: rm this fallback after 4/2023
    jumper.call('storage.set', { key: 'mogul-menu:accessToken', value: token })
  ]);
}