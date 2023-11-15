import { Client } from "@urql/core";
import { createApiClient, ApiClientOptions } from "../api";
import { TruffleUserClient } from "../user";
import { TruffleOrgClient } from "../org";
import { TruffleOrgUserClient } from "../org-user";
import { getEmbedConsumer } from "../transframe/embed-consumer";

export class TruffleApp {
  private _gqlClient: Client;
  private _user: TruffleUserClient;
  private _orgUser: TruffleOrgUserClient;
  private _org: TruffleOrgClient;
  private _isAuthenticated = false;

  constructor(clientOptions?: ApiClientOptions) {
    const updateClient = (clientOptions?: ApiClientOptions) => {
      this._gqlClient = createApiClient(clientOptions);
      this._user.gqlClient = this._gqlClient;
      this._orgUser.gqlClient = this._gqlClient;
      this._org.gqlClient = this._gqlClient;
    };

    // NOTE: we don't want this called on app.truffle.vip, because the sidebar and embed page
    // are often iframed and shouldn't be transframing into the parent window.
    // app.truffle.vip provides userAccessToken in the options.
    // I (Austin H) am not sure why we were doing this if orgId wasn't specified 11/9/23
    // if (!clientOptions?.userAccessToken || !clientOptions?.orgId) {
    if (!clientOptions?.userAccessToken) {
      // in this case, we're probably initializing the app
      // as the default app, so we want to listen for changes
      // to the authentication state
      getEmbedConsumer().call(
        "userOnAccessTokenChanged",
        (accessToken: string) => {
          updateClient({
            userAccessToken: accessToken,
            ...clientOptions,
          });
        },
        // we're doing an initial initialization of the client
        // below, so we don't want this to fire until the token actually changes
        { immediate: false },
      )
        // don't really need to do anything here if this fails
        .catch(() =>
          console.warn(
            "[@trufflehq/sdk] Failed to listen for access token changes",
          )
        );
    }

    // initialize the client;
    // we can't use updateClient() here because typescript
    // needs to know that these get initialized in the constructor
    this._gqlClient = createApiClient(clientOptions);
    this._user = new TruffleUserClient(this._gqlClient);
    this._orgUser = new TruffleOrgUserClient(this._gqlClient);
    this._org = new TruffleOrgClient(this._gqlClient);
  }

  public get isAuthenticated() {
    return this._isAuthenticated;
  }

  public get gqlClient() {
    return this._gqlClient;
  }

  public get user() {
    return this._user;
  }

  public get org() {
    return this._org;
  }

  public get orgUser() {
    return this._orgUser;
  }
}
