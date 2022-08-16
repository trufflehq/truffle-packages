import {
  RouteConnection,
} from "https://tfl.dev/@truffle/api@^0.1.3/types/mod.ts";

export interface ClientConfig {
  IS_DEV_ENV: boolean;
  IS_STAGING_ENV: boolean;
  IS_PROD_ENV: boolean;
  PUBLIC_API_URL: string;
  API_URL: string;
  HOST: string;
}

export interface ClientContext {
  orgId?: string;
  packageVersionId?: string;
  packageId?: string;
}

export interface InitialClientData {
  clientConfig: ClientConfig;
  clientContext: ClientContext;
  routes: RouteConnection;
}

export interface GlobalStore extends InitialClientData {
  [x: string]: unknown;
}
