import { TransframeConsumer } from "../../transframe-consumer";
import { TransframeProvider } from "../../transframe-provider";
import type { TransframeConsumerOptions, TransframeProviderOptions, TransframeSourceApi } from "../../types";
import { IframeConsumerInterface } from "./consumer";
import { IframeProviderInterface } from "./provider";
import type { IframeConsumerInterfaceOptions, IframeInterfaceContext, IframeProviderInterfaceOptions } from "./types";

export function createIframeProvider<Api extends TransframeSourceApi<IframeInterfaceContext>>(
  options: TransframeProviderOptions<Api> & IframeProviderInterfaceOptions
) {
  return new TransframeProvider<HTMLIFrameElement, TransframeSourceApi<IframeInterfaceContext>>(
    new IframeProviderInterface(options),
    options
  )
}

export function createIframeConsumer<Api extends TransframeSourceApi<IframeInterfaceContext>>
(options?: TransframeConsumerOptions<Api> & IframeConsumerInterfaceOptions) {
  return new TransframeConsumer<Api>(
    new IframeConsumerInterface(options),
    options
  );
}

export function createIframeApi
<Api extends TransframeSourceApi<IframeInterfaceContext>>(api: Api) {
  return api;
}
