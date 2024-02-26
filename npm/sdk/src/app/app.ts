import { Client } from '@urql/core';
import { MothertreeClient } from '@trufflehq/mothertree-client';
import { createApiClient, ApiClientOptions } from '../api';
import { DEFAULT_MOTHERTREE_API_URL } from '../constants';

export class TruffleApp {
  private _gqlClient: Client;
  private _mtClient: MothertreeClient;

  constructor(clientOptions?: ApiClientOptions) {
    this._gqlClient = createApiClient(clientOptions);
    this._mtClient = new MothertreeClient({
      url: clientOptions?.url ?? DEFAULT_MOTHERTREE_API_URL,
      accessToken: clientOptions?.userAccessToken,
      wsClient: null,

      // instead of using the default query executor,
      // we're going to use urql as our query executor
      queryExecutor: async (query, variables, options) => {
        return await this._gqlClient
          .query(query, variables, options)
          .toPromise();
      },

      // instead of using the default mutation executor,
      // we're going to use urql as our mutation executor
      mutationExecutor: async (query, variables, options) => {
        return await this._gqlClient
          .mutation(query, variables, options)
          .toPromise();
      },
    });
  }

  public get gqlClient() {
    return this._gqlClient;
  }

  public get mtClient() {
    return this._mtClient;
  }

  public destroy() {
    this._mtClient.close();
  }
}
