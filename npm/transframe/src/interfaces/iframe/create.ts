import { TransframeConsumer } from "../../transframe-consumer";
import { TransframeProvider } from "../../transframe-provider";
import { TransframeConsumerOptions, TransframeProviderOptions, TransframeSourceApi } from "../../types";
import { IframeConsumerInterface } from "./consumer";
import { IframeProviderInterface } from "./provider";
import { IframeConsumerInterfaceOptions, IframeProviderInterfaceOptions } from "./types";

export function createIframeProvider(options: TransframeProviderOptions & IframeProviderInterfaceOptions) {
  return new TransframeProvider(
    new IframeProviderInterface(options),
    options
  )
}

export function createIframeConsumer<Api extends TransframeSourceApi>
(options?: TransframeConsumerOptions<Api> & IframeConsumerInterfaceOptions) {
  return new TransframeConsumer(
    new IframeConsumerInterface(options),
    options
  );
}
