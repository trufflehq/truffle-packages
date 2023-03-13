import Browser from "webextension-polyfill";

export interface BackgroundScriptConsumerInterfaceOptions {
  channelName?: string;
}

export type BackgroundScriptInterfaceContext = {
  port: Browser.Runtime.Port;
}