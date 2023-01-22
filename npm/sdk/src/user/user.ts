import { Client } from "@urql/core";
import { map, pipe, toObservable } from 'wonka';
import { GQLConnection } from "../types";
import { SwitchableObservable } from "../util/switchable-observable";

export interface TruffleImage {
  cdn: string;
  prefix: string;
  ext: string;
  variations: {
    postfix: string;
    width: number;
    height: number;
  }[];
  aspectRatio: number;
}
export interface TruffleUser {
  id: string;
  name: string;
  avatarImage: TruffleImage;
}

export interface TrufflePermission {
  id: string;
  slug: string;
  name: string;
  filters: any;
  action: string;
  value: boolean;
}

export type TrufflePermissionConnection = GQLConnection<TrufflePermission>;

export interface TruffleRole {
  id: string;
  slug: string;
  name: string;
  permissionConnection: TrufflePermissionConnection;
}

export type TruffleRoleConnection = GQLConnection<TruffleRole>;

export interface TruffleComponentRel {
  id: string;
  props: any;
}

export interface TrufflePowerup {
  id: string;
  slug: string;
  jsx: string;
  componentRels: TruffleComponentRel[];
}

export type TrufflePowerupConnection = GQLConnection<TrufflePowerup>;

export interface TruffleOrgUser {
  id: string;
  name: string;
  roleConnection: TruffleRoleConnection;
  activePowerupConnection: TrufflePowerupConnection;
}

export class TruffleUserClient {

  public observable: SwitchableObservable<TruffleUser>;
  public orgUserObservable: SwitchableObservable<TruffleOrgUser>;
  
  private _userObj: TruffleUser | null = null;

  constructor (private _gqlClient: Client) {
    this.observable = new SwitchableObservable(this._getUserObservable());
    this.orgUserObservable = new SwitchableObservable(this._getOrgUserObservable());

    this.observable.subscribe({
      next: (user) => {
        this._userObj = user;
      },
      error: (err) => {
        console.error('truffle user subscription error', err);
      },
      complete: () => {
        console.log('truffle user subscription complete');
      }
    })

  }

  private _getOrgUserObservable () {
    return pipe(
      this._gqlClient.query<{ orgUser: TruffleOrgUser }>(
        `query {
          orgUser {
            id
            name
            roleConnection {
              nodes {
                id
                slug
                name
                permissionConnection {
                  nodes {
                    id
                    filters
                    action
                    value
                  }
                }
              }
            }
            activePowerupConnection {
              nodes {
                powerup {
                  id
                  slug
                  jsx
                  componentRels {
                    props
                  }
                }
              }
            }
          }
        }`
      , {}),
      map((res) => res.data?.orgUser),
      toObservable,
    )
  }

  private _getUserObservable () {
    return pipe(
      this._gqlClient.query<{ me: TruffleUser }>(
        `query {
          me {
            id
            name
            avatarImage {
              cdn
              prefix
              ext
              variations {
                postfix
                width
                height
              }
              aspectRatio
            }
          }
        }`
      , {}),
      map((res) => res.data?.me),
      toObservable,
    )
  }

  public get gqlClient () {
    return this._gqlClient;
  }

  public set gqlClient (client: Client) {
    this._gqlClient = client;
    // switch the underlying observable and refresh the user object
    const newObservable = this._getUserObservable();
    this.observable.switch(newObservable);
  }

  /**
   * Returns the user id.
   */
  public get id() {
    return this._userObj?.id;
  }

  /**
   * Returns the user name.
   */
  public get name() {
    return this._userObj?.name;
  }

  /**
   * The avatar image object.
   */
  public get avatarImage () {
    return this._userObj?.avatarImage;
  }

  /**
   * Returns the org user object.
   */
  public get orgUser () {
    return {
      observable: this.orgUserObservable
    };
  }
}