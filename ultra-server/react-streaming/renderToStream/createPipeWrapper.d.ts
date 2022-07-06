/// <reference types="node" />
export { createPipeWrapper };
export type { Pipe };
import type { Writable as StreamNodeWritable } from 'stream';
declare type Pipe = (writable: StreamNodeWritable) => void;
declare function createPipeWrapper(pipeOriginal: Pipe, { onReactBug }: {
    onReactBug: (err: unknown) => void;
}): Promise<{
    pipeWrapper: Pipe;
    streamEnd: Promise<void>;
    injectToStream: (chunk: string) => void;
}>;
