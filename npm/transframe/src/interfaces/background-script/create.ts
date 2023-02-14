import { TransframeConsumer } from "../../transframe-consumer";
import { TransframeProvider } from "../../transframe-provider";
import { TransframeConsumerOptions, TransframeProviderOptions, TransframeSourceApi } from "../../types";
import { BackgroundScriptConsumerInterface } from "./consumer";
import { BackgroundScriptProviderInterface } from "./provider";
import { BackgroundScriptConsumerInterfaceOptions } from "./types";

export function createBackgroundScriptConsumer<T extends TransframeSourceApi>(
  options?: BackgroundScriptConsumerInterfaceOptions & TransframeConsumerOptions<T>
) {
  return new TransframeConsumer(
    new BackgroundScriptConsumerInterface(options),
    options
  );
}

export function createBackgroundScriptProvider(options: TransframeProviderOptions) {
  return new TransframeProvider(
    new BackgroundScriptProviderInterface(),
    options
  );
}