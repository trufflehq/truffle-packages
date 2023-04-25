import { initTruffleApp } from '@trufflehq/sdk';
import { isSsr } from './util';

// only initialize truffle if we're not server-side rendering
export const truffle = isSsr ? undefined : initTruffleApp();
