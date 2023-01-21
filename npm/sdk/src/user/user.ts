import { Client } from "@urql/core";
import { map, pipe, toObservable } from 'wonka';
import { SwitchableObservable } from "../util/switchable-observable";

export interface TruffleUser {
  id: string;
  name: string;
}

type Observable<T> = ReturnType<typeof toObservable<T>>;
export class TruffleUserClient {

  public observable: SwitchableObservable<TruffleUser>;
  
  private _userObj: TruffleUser | null = null;

  constructor (private _gqlClient: Client) {
    this.observable = new SwitchableObservable(this._getUserObservable())

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

  private _getUserObservable () {
    return pipe(
      this._gqlClient.query<{ me: TruffleUser }>(
        `query {
          me {
            id
            name
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
}