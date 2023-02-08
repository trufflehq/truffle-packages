// the following types help us type the api that users create;

// for some reason, typescript gave me fits when I used the `Function` type, so I created my own
export type ApiFunction<P, R> = (fromId: string | undefined, ...args: P[]) => R

// an api is just a map of functions
export type TransframeSourceApi = Record<string, ApiFunction<any, unknown>>

// using this to drop the fromId parameter from the api functions
// because the consumer api will not have it
type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never
// the consumer api is going to be (almost) the same as the source api,
// but every function is async because it has to do an rpc call;
export type TransframeConsumerApi<T extends TransframeSourceApi> = {
  [K in keyof T]: (...args: DropFirst<Parameters<T[K]>>) => Promise<ReturnType<T[K]>>;
}

export interface TransframeProviderOptions {
  /**
   * The api that will be exposed to the consumers
   */
  api: TransframeSourceApi;

  /**
   * Whether to automatically start listening for messages
   */
  listenImmediately?: boolean;

  /**
   * When strict mode is enabled, only iframes that are registered
   * with the provider will be able to communicate with it.
   */
  strictMode?: boolean;
}

export interface TransframeConsumerOptions<T extends TransframeSourceApi> {
  /**
   * The source api used by the provider.
   * This is only used for typing.
   */
  api?: T;

  /**
   * Whether to automatically connect to the provider.
   * Default is true.
   * If you set this to false, you will have to call the connect method manually.
   */
  connectImmediately?: boolean;

  /**
   * The number of milliseconds to wait for a response from the provider.
   * Default is 5000.
   */
  apiCallTimeout?: number;
}
