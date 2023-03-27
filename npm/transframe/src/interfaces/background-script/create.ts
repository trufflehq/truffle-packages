import { TransframeConsumer } from "../../transframe-consumer";
import { TransframeProvider } from "../../transframe-provider";
import type { TransframeConsumerOptions, TransframeProviderOptions, TransframeSourceApi } from "../../types";
import { BackgroundScriptConsumerInterface } from "./consumer";
import { BackgroundScriptProviderInterface } from "./provider";
import type { BackgroundScriptConsumerInterfaceOptions, BackgroundScriptInterfaceContext } from "./types";

export function createBackgroundScriptConsumer
<Api extends TransframeSourceApi<BackgroundScriptInterfaceContext>>
(
  options?: BackgroundScriptConsumerInterfaceOptions & TransframeConsumerOptions<Api>
) {
  return new TransframeConsumer<Api>(
    new BackgroundScriptConsumerInterface(options),
    options
  );
}

export function createBackgroundScriptProvider
<Api extends TransframeSourceApi<BackgroundScriptInterfaceContext>>(
  options: TransframeProviderOptions<Api>
) {
  return new TransframeProvider<never, TransframeSourceApi<BackgroundScriptInterfaceContext>>(
    new BackgroundScriptProviderInterface(),
    options
  );
}

export function createBackgroundScriptApi
<Api extends TransframeSourceApi<BackgroundScriptInterfaceContext>>(api: Api) {
  return api;
}
