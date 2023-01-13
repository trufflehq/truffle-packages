import { Client } from "@urql/core";
import { createMyceliumClient, MyceliumClientOptions } from "../mycelium";

export interface TruffleUser {
  id: string;
  name: string;
}

export class TruffleUserClient {

  public gqlClient: Promise<Client> | null = null;

  private _userObj: TruffleUser | null = null;

  constructor (clientOptions?: MyceliumClientOptions) {
    this.gqlClient = createMyceliumClient(clientOptions) as Promise<Client>
  }

  public isAuthenticated() {
    return !!this.gqlClient;
  }

  public get name() {
    return this._userObj?.name;
  }

  public async getName() {
    const res = await (await this.gqlClient)?.query(
      `query {
        me {
          id
          name
        }
      }`
    , {}).toPromise();
    return res?.data?.me?.name;
  }
  
}

export const user = new TruffleUserClient();