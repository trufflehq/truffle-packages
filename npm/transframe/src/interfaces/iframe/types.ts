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
}