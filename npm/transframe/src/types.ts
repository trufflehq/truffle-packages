// the following types help us type the api that users create

// the context is the object that is passed to every api function
type ContextBase = {
  fromId: string | undefined;
};

// different interfaces will add properties to the context
export type Context<T> = ContextBase & T;

// for some reason, typescript gave me fits when I used the `Function` type, so I created my own
export type SourceApiFunction<C, P, R> = (context: Context<C>, ...args: P[]) => R

// an api is just a map of functions
export type TransframeSourceApi<C> = Record<string, SourceApiFunction<C, any, unknown>>

// this utility type is used to get the context type from the api
export type ContextFromSourceApi<SourceApiType> = SourceApiType extends TransframeSourceApi<infer ContextType> ? ContextType : never

// using this to drop the fromId parameter from the api functions
// because the consumer api will not have it
type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never
// the consumer api is going to be (almost) the same as the source api,
// but every function is async because it has to do an rpc call;
export type TransframeConsumerApi<SourceApi extends TransframeSourceApi<ContextFromSourceApi<SourceApi>>> = {
  [K in keyof SourceApi]: (...args: DropFirst<Parameters<SourceApi[K]>>) => Promise<ReturnType<SourceApi[K]>>;
}

export interface TransframeProviderOptions<SourceApi extends TransframeSourceApi<ContextFromSourceApi<SourceApi>>> {
  /**
   * The api that will be exposed to the consumers
   */
  api: SourceApi;

  /**
   * Whether to automatically start listening for messages
   */
  listenImmediately?: boolean;

  /**
   * When strict mode is enabled, only frames that are registered
   * with the provider will be able to communicate with it.
   */
  strictMode?: boolean;

  /**
   * The namespace to use. If not specified, the provider will
   * listen for messages that do not have a namespace specified.
   */
  namespace?: string;
}

export interface TransframeConsumerOptions<T extends TransframeSourceApi<any>> {
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

  /**
   * The namespace to use. If not specified, the consumer will
   * communicate with providers that do not have a namespace specified.
   */
  namespace?: string; 
}
