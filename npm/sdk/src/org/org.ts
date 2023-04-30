import { Client } from '@urql/core';
import { map, pipe, toObservable } from 'wonka';
import { getTruffleApp } from '../app';
import { SwitchableObservable } from '../util/switchable-observable';
import { ORG_QUERY } from './gql';

export interface TruffleOrg {
  id: string;
  name: string;
  slug: string;
}

export interface TruffleOrgInput {
  id: string;
  slug: string;
}

export class TruffleOrgClient {
  private _observable: SwitchableObservable<TruffleOrg>;

  constructor(private _gqlClient: Client, private _orgInput?: TruffleOrgInput) {
    this._observable = new SwitchableObservable(this._getOrgObservable());
  }

  private _getOrgObservable() {
    return pipe(
      this._gqlClient.query<{ org: TruffleOrg }>(ORG_QUERY, this._orgInput),
      map((res) => res.data?.org),
      toObservable
    );
  }

  public get gqlClient() {
    return this._gqlClient;
  }

  public set gqlClient(client: Client) {
    this._gqlClient = client;
  }

  public get observable() {
    return this._observable;
  }
}

export function getOrgClient(instanceName?: string) {
  const app = getTruffleApp(instanceName);
  return app.org;
}
