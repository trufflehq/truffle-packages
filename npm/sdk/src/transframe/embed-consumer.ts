import {
  Context,
  TransframeConsumer,
  TransframeSourceApi,
} from '@trufflehq/transframe';
import {
  createIframeConsumer,
  IframeInterfaceContext,
} from '@trufflehq/transframe/iframe';

// TODO: relocate this so that it can be imported into ext code
export interface EmbedSourceApi
  extends TransframeSourceApi<IframeInterfaceContext> {
  embedSetStyles(
    context: Context<IframeInterfaceContext>,
    styles: Record<string, unknown>
  ): void;
}

let embedConsumer: TransframeConsumer<EmbedSourceApi>;

export function getEmbedConsumer() {
  if (!embedConsumer) {
    embedConsumer = createIframeConsumer({
      namespace: 'truffle-injected-unprivileged-embed-api-v1',
      useDirectParent: true,
    });
  }

  return embedConsumer;
}
