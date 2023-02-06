export interface IframeProviderInterfaceOptions {
  /**
   * A whitelist of origins that are allowed to communicate with the provider
   */
  allowedOrigins?: string[];
}

export interface IframeConsumerInterfaceOptions {
  /**
   * A whitelist of origins that the consumer is allowed to use as providers
   */
  allowedOrigins?: string[];

  /**
   * Whether or not to use the direct the parent window as the provider.
   * By default, the consumer will use window.top, but if this is set to true,
   * it will use window.parent instead.
   */
  useDirectParent?: boolean;
}