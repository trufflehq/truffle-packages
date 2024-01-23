import { Client, ExecutionResult } from 'graphql-ws';
import { WSClientOptions, createWSClient } from './ws-client';
import { verify as jwtVerify } from 'jsonwebtoken';
import { MOTHERTREE_PUBLIC_ES256_KEY } from './constants';

type QueryExecutor = (
  query: string,
  variables: any,
  options: any
) => Promise<ExecutionResult>;

type MothertreeClientOptions = WSClientOptions & {
  /**
   * Set a custom query executor. Given a query string, variables,
   * and an optional set of options, this will execute a graphql query.
   * This is mainly used so that we can use urql in the browser.
   */
  queryExecutor?: QueryExecutor;

  /**
   * Set a custom graphql-ws client.
   * If left undefined, a client will be created automatically.
   * If set to null, no client will be created.
   */
  wsClient?: Client | null;
};

interface AccessTokenPayload {
  sub: string;
  nonce: number;
  type: string;
  isAnon: boolean;
  orgId?: string;
  orgMemberId?: string;
  packageId?: string;
  packageInstallId?: string;
}

interface OrgMemberInput {
  id?: string;
  orgId?: string;
  orgIdAndUserId?: {
    orgId: string;
    userId: string;
  };
}

interface OrgPayload {
  id: string;
  name: string;
}

interface OrgMemberPayload {
  id: string;
  name: string;
}

interface RolePayload {
  id: string;
  slug: string;
}

export class MothertreeClient {
  // this is public so that devs can switch out the wsClient;
  // for example, this would be useful if the authentication state changes
  public wsClient?: Client;

  // user details
  private _accessTokenPayload?: AccessTokenPayload;

  constructor(options?: MothertreeClientOptions) {
    if (options?.wsClient !== null) {
      this.wsClient =
        options?.wsClient ??
        createWSClient({
          url: options?.url,
          accessToken: options?.accessToken,
        });
    }

    // set the query executor
    if (options?.queryExecutor) this._queryExecutor = options?.queryExecutor;

    // parse/set the access token
    if (options?.accessToken) {
      this._accessTokenPayload = jwtVerify(
        options.accessToken,
        MOTHERTREE_PUBLIC_ES256_KEY,
        {
          algorithms: ['ES256'],
        }
      ) as AccessTokenPayload;
    }
  }

  // allow the dev to set a custom query executor;
  // this is mainly used so that we can use urql in the browser
  private _queryExecutor: QueryExecutor = async (
    query,
    variables,
    options?: { extensions?: Record<string, unknown>; operationName?: string }
  ) => {
    return await new Promise<ExecutionResult>((res, rej) => {
      if (this.wsClient) {
        const unsubscribe = this.wsClient.subscribe(
          {
            query,
            variables,
            extensions: options?.extensions,
            operationName: options?.operationName,
          },
          {
            next(val) {
              res(val as ExecutionResult);
            },
            error(err) {
              rej(err);
            },
            complete() {
              unsubscribe();
            },
          }
        );
      }
    });
  };

  private _noAccessTokenError = new Error('No access token');

  get userId() {
    if (!this._accessTokenPayload) throw this._noAccessTokenError;
    return this._accessTokenPayload.sub;
  }

  get orgId() {
    if (!this._accessTokenPayload) throw this._noAccessTokenError;
    return this._accessTokenPayload.orgId;
  }

  get orgMemberId() {
    if (!this._accessTokenPayload) throw this._noAccessTokenError;
    return this._accessTokenPayload.orgMemberId;
  }

  get appId() {
    if (!this._accessTokenPayload) throw this._noAccessTokenError;
    return this._accessTokenPayload.packageId;
  }

  get appInstallId() {
    if (!this._accessTokenPayload) throw this._noAccessTokenError;
    return this._accessTokenPayload.packageInstallId;
  }

  public close() {
    this.wsClient?.dispose();
  }

  public async getOrgMember(
    input?: {
      id?: string;
      orgId?: string;
      orgIdAndUserId?: {
        orgId: string;
        userId: string;
      };
    },
    options?: any
  ) {
    const { data, errors } = await this._queryExecutor(
      'query($input: OrgMemberInput) { orgMember(input: $input) { id name } }',
      { input },
      options
    );

    if (errors) throw errors;
    return data?.orgMember as OrgMemberPayload;
  }

  public async getOrg(
    input?: {
      id?: string;
      slug?: string;
      domain?: string;
    },
    options?: any
  ) {
    const { data, errors } = await this._queryExecutor(
      'query($input: OrgInput) { org(input: $input) { id name } }',
      { input },
      options
    );

    if (errors) throw errors;
    return data?.org as OrgPayload;
  }

  public async getRoles(input?: OrgMemberInput, options?: any) {
    const { data, errors } = await this._queryExecutor(
      'query($input: OrgMemberInput) { orgMember(input: $input) { roles { id slug } } }',
      { input },
      options
    );

    if (errors) throw errors;
    return (data as any)?.orgMember?.roles as RolePayload[];
  }
}
