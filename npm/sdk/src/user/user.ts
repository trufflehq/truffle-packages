import { Client } from '@urql/core';
import { map, pipe, toObservable } from 'wonka';
import { getTruffleApp } from '../app';
import { TruffleImage } from '../util/image';
import { SwitchableObservable } from '../util/switchable-observable';
import { ME_USER_QUERY } from './gql';

export interface TruffleUser {
  id: string;
  name: string;
  avatarImage: TruffleImage;
}

export class TruffleUserClient {
  private _observable: SwitchableObservable<TruffleUser>;

  constructor(private _gqlClient: Client) {
    this._observable = new SwitchableObservable(this._getUserObservable());
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
    // switch the underlying observable and refresh the user object
    const newObservable = this._getUserObservable();
    this._observable.switch(newObservable);
  }

  public get observable() {
    return this._observable;
  }
}

export function getUserClient(instanceName?: string) {
  const app = getTruffleApp(instanceName);
  return app.user;
}
