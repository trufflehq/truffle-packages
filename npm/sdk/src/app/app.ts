import { Client } from "@urql/core";
import { createMyceliumClient, MyceliumClientOptions } from "../mycelium";
import { TruffleUserClient } from "../user";
import { jumper } from '../jumper/jumper-instance';
import { getOrgId } from "../org/get-id";

export class TruffleApp {
  public gqlClient: Client;
  public user: TruffleUserClient;

  constructor (clientOptions?: MyceliumClientOptions) {

    const updateClient = (clientOptions?: MyceliumClientOptions) => {
      console.log('updating mycelium client')
      this.gqlClient = createMyceliumClient(clientOptions);
      this.user.gqlClient = this.gqlClient;
    }

    if (!clientOptions?.userAccessToken || !clientOptions?.orgId) {
      // in this case, we're probably initializing the app
      // as the default app, so we want to listen for changes
      // to the authentication state
      getOrgId().then((orgId) => {
        jumper.call(
          "user.onAccessTokenChange",
          { orgId },
          ({ _accessToken }: { _accessToken: string }) => {
            console.log('user access token changed!')
            updateClient(clientOptions);
          },
        );
      })
    
      // TODO: legacy, rm 4/2023
      jumper.call("comms.onMessage", (message: string) => {
        if (message === "user.accessTokenUpdated") {
          console.log('user access token changed! [legacy]')
          updateClient(clientOptions);
        }
      });
      // end legacy
    }

    console.log('creating mycelium client')
    this.gqlClient = createMyceliumClient(clientOptions);
    this.user = new TruffleUserClient(this.gqlClient);
  }

  public get isAuthenticated () {
    return true;
  }
}