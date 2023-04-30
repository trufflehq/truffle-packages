import { Client } from '@urql/core';
import { map, pipe, toObservable } from 'wonka';
import { getTruffleApp } from '../app';
import { TruffleRoleConnection } from '../role';
import { TrufflePowerupConnection } from '../types/truffle';
import { SwitchableObservable } from '../util/switchable-observable';
import { ORG_USER_QUERY } from './gql';

export interface TruffleOrgUser {
  id: string;
  name: string;
  roleConnection: TruffleRoleConnection;
  activePowerupConnection: TrufflePowerupConnection;
}

export interface TruffleOrgUserInput {
  id?: string;
  userId?: string;
  orgId?: string;
}

export class TruffleOrgUserClient {
  private _observable: SwitchableObservable<TruffleOrgUser>;

  constructor(
    private _gqlClient: Client,
    private _input?: TruffleOrgUserInput
  ) {
    this._observable = new SwitchableObservable(this._getOrgUserObservable());
  }

  private _getOrgUserObservable() {
    return pipe(
      this._gqlClient.query<{ orgUser: TruffleOrgUser }>(
        ORG_USER_QUERY,
        this._input
      ),
      map((res) => res.data?.orgUser),
      toObservable
    );
  }

  public get observable() {
    return this._observable;
  }

  public get gqlClient() {
    return this._gqlClient;
  }

  public set gqlClient(client: Client) {
    this._gqlClient = client;
    // switch the underlying observable and refresh the user object
    const newObservable = this._getOrgUserObservable();
    this._observable.switch(newObservable);
  }
}

export function getOrgUserClient(instanceName?: string) {
  const app = getTruffleApp(instanceName);
  return app.orgUser;
}
