import { Client } from '@urql/core';
import { createMyceliumClient, MyceliumClientOptions } from '../mycelium';
import { TruffleUserClient } from '../user';
import { jumper } from '../jumper/jumper-instance';
import { getOrgId } from '../org/get-id';
import { TruffleOrgClient } from '../org';

export class TruffleApp {
  private _gqlClient: Client;
  private _user: TruffleUserClient;
  private _org: TruffleOrgClient;
  private _isAuthenticated = false;

  constructor(clientOptions?: MyceliumClientOptions) {
    const updateClient = (clientOptions?: MyceliumClientOptions) => {
      this._gqlClient = createMyceliumClient(clientOptions);
      this._user.gqlClient = this._gqlClient;
      this._org.gqlClient = this._gqlClient;
    };

    if (!clientOptions?.userAccessToken || !clientOptions?.orgId) {
      // in this case, we're probably initializing the app
      // as the default app, so we want to listen for changes
      // to the authentication state
      getOrgId().then((orgId) => {
        jumper.call(
          'user.onAccessTokenChange',
          { orgId },
          ({ _accessToken }: { _accessToken: string }) => {
            // console.log('user access token changed!')
            updateClient(clientOptions);
          }
        );
      });

      // TODO: legacy, rm 4/2023
      jumper.call('comms.onMessage', (message: string) => {
        if (message === 'user.accessTokenUpdated') {
          // console.log('user access token changed! [legacy]')
          updateClient(clientOptions);
        }
      });
      // end legacy
    }

    this._gqlClient = createMyceliumClient(clientOptions);
    this._user = new TruffleUserClient(this._gqlClient);
    this._org = new TruffleOrgClient(this._gqlClient);
  }

  public get isAuthenticated() {
    return this._isAuthenticated;
  }

  public get gqlClient() {
    return this._gqlClient;
  }

  public get user() {
    return this._user;
  }

  public get org() {
    return this._org;
  }
}
