/// <reference types="node" />
export { loadNodeStreamModule };
export { nodeStreamModuleIsAvailable };
import type { Readable as StreamNodeReadable, Writable as StreamNodeWritable } from 'stream';
declare type StreamModule = {
    Readable: typeof StreamNodeReadable;
    Writable: typeof StreamNodeWritable;
};
declare function loadNodeStreamModule(): Promise<StreamModule>;
declare function nodeStreamModuleIsAvailable(): Promise<boolean>;
