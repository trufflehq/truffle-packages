import { createIframeConsumer } from '@trufflehq/transframe/iframe';

export const embedConsumer = createIframeConsumer({
  namespace: 'truffle-injected-unprivileged-embed-api-v1',
  useDirectParent: true,
});
