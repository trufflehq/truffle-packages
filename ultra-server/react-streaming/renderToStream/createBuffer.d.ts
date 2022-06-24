export { createBuffer };
declare function createBuffer(bufferParams: {
    writeChunk: null | ((_chunk: string) => void);
}): {
    injectToStream: (chunk: string) => void;
    onBeforeWrite: (chunk: unknown) => void;
    onBeforeEnd: () => void;
};
