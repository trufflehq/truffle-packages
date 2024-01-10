import type Browser from "webextension-polyfill";

export interface BackgroundScriptConsumerInterfaceOptions {
  channelName?: string;
}

export type BackgroundScriptInterfaceContext = {
  port: Browser.Runtime.Port;
}

export type ModifiedPort = Browser.Runtime.Port & {
  _timer?: ReturnType<typeof setTimeout>;
}