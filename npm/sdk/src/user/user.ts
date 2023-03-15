import { Client } from '@urql/core';
import { map, pipe, toObservable } from 'wonka';
import { TruffleOrgUserClient } from '../org-user';
import { TruffleRoleConnection } from '../role/role';
import { TrufflePowerupConnection } from '../types/truffle';
import { TruffleImage } from '../util/image';
import { SwitchableObservable } from '../util/switchable-observable';
import { ME_USER_QUERY } from './gql';

export interface TruffleUser {
  id: string;
  name: string;
  avatarImage: TruffleImage;
}

export interface TruffleOrgUser {
  id: string;
  name: string;
  roleConnection: TruffleRoleConnection;
  activePowerupConnection: TrufflePowerupConnection;
}

export class TruffleUserClient {
  private _observable: SwitchableObservable<TruffleUser>;
  private _orgUser: TruffleOrgUserClient;

  constructor(private _gqlClient: Client) {
    this._observable = new SwitchableObservable(this._getUserObservable());
    this._orgUser = new TruffleOrgUserClient(this._gqlClient);
  }

  private _getUserObservable() {
    return pipe(
      this._gqlClient.query<{ me: TruffleUser }>(ME_USER_QUERY, {}),
      map((res) => res.data?.me),
      toObservable
    );
  }

  public get gqlClient() {
    return this._gqlClient;
  }

  public set gqlClient(client: Client) {
    this._gqlClient = client;
    this._orgUser.gqlClient = client;
    // switch the underlying observable and refresh the user object
    const newObservable = this._getUserObservable();
    this._observable.switch(newObservable);
  }

  public get observable() {
    return this._observable;
  }

  /**
   * Returns the org user object.
   */
  public get orgUser() {
    return this._orgUser;
  }
}
