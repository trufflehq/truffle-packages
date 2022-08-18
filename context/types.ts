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
  routes: NestedRoute[];
}

export interface DBNestedRoute {
  path: string;
  type: string;
  moduleUrl?: string;
  children: DBNestedRoute[];
}

export interface FSNestedRoute {
  fullPath: string;
  path: string;
  moduleUrl?: string;
  depth: number;
  children: FSNestedRoute[];
}

export type NestedRoute = DBNestedRoute | FSNestedRoute;

export interface GlobalStore extends InitialClientData {
  [x: string]: unknown;
}
