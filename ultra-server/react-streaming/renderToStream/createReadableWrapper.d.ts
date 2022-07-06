export { createReadableWrapper };
declare function createReadableWrapper(readableOriginal: ReadableStream): {
    readableWrapper: ReadableStream<any>;
    streamEnd: Promise<void>;
    injectToStream: (chunk: string) => void;
};
