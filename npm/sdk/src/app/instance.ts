import { ApiClientOptions } from '../api';
import { getEmbedConsumer } from '../transframe/embed-consumer';
import { TruffleApp } from './app';

const DEFAULT_APP_INSTANCE_NAME = 'default';

const appInstances: Map<string, TruffleApp> = new Map();

type InitTruffleAppOptions = {
  instanceName?: string;
} & Partial<ApiClientOptions>;

export function initTruffleApp(options: InitTruffleAppOptions = {}) {
  // make sure we can initialize the embed consumer;
  // this will throw if we're not in an embed
  getEmbedConsumer();

  const app = new TruffleApp(options);
  const instanceName = options.instanceName || DEFAULT_APP_INSTANCE_NAME;
  appInstances.set(instanceName, app);
  return app;
}

export function getTruffleApp(instanceName?: string) {
  const name = instanceName || DEFAULT_APP_INSTANCE_NAME;
  const app = appInstances.get(name);

  if (!app) {
    throw new Error(`No TruffleApp instance found with name ${name}`);
  }

  return app;
}
