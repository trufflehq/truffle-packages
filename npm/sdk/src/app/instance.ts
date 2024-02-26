import { ApiClientOptions } from '../api';
import { getAccessToken } from '../transframe/access-token';
import { getEmbedConsumer } from '../transframe/embed-consumer';
import { TruffleApp } from './app';

const DEFAULT_APP_INSTANCE_NAME = 'default';

const appInstances: Map<string, TruffleApp> = new Map();

type InitTruffleAppOptions = {
  instanceName?: string;
} & Partial<ApiClientOptions>;

type SubscribeToAuthOptions = Omit<InitTruffleAppOptions, 'userAccessToken'>;

export function initTruffleApp(options: InitTruffleAppOptions = {}) {
  const app = new TruffleApp(options);
  const instanceName = options.instanceName || DEFAULT_APP_INSTANCE_NAME;
  appInstances.set(instanceName, app);
  return app;
}

export function subscribeToAuth(
  callback: (newApp: TruffleApp) => void,
  options?: SubscribeToAuthOptions
) {
  const refreshTruffleApp = (accessToken: string) => {
    // destroy the previous app instance if it exists
    appInstances
      .get(options?.instanceName ?? DEFAULT_APP_INSTANCE_NAME)
      ?.destroy();

    // reinitialize the app instance
    // and notify the subscriber
    callback(
      initTruffleApp({
        userAccessToken: accessToken,
        ...options,
      })
    );
  };

  // subscribe to the access token changes
  getEmbedConsumer().call('userOnAccessTokenChanged', refreshTruffleApp, {
    immediate: true,
  });
}

export function getTruffleApp(instanceName?: string) {
  const name = instanceName || DEFAULT_APP_INSTANCE_NAME;
  const app = appInstances.get(name);

  if (!app) {
    throw new Error(`No TruffleApp instance found with name ${name}`);
  }

  return app;
}

export function getMtClient(instanceName?: string) {
  return getTruffleApp(instanceName).mtClient;
}
