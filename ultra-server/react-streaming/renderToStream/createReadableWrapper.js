export { createReadableWrapper };
import { createBuffer } from './createBuffer.js';
function createReadableWrapper(readableOriginal) {
    const bufferParams = {
        writeChunk: null
    };
    let controllerWrapper;
    let onEnded;
    const streamEnd = new Promise((r) => {
        onEnded = () => r();
    });
    const readableWrapper = new ReadableStream({
        start(controller) {
            controllerWrapper = controller;
            onReady(onEnded);
        }
    });
    const { injectToStream, onBeforeWrite, onBeforeEnd } = createBuffer(bufferParams);
    return { readableWrapper, streamEnd, injectToStream };
    async function onReady(onEnded) {
        const writeChunk = (bufferParams.writeChunk = (chunk) => {
            controllerWrapper.enqueue(encodeForWebStream(chunk));
        });
        const reader = readableOriginal.getReader();
        while (true) {
            let result;
            try {
                result = await reader.read();
            }
            catch (err) {
                controllerWrapper.close();
                throw err;
            }
            const { value, done } = result;
            if (done) {
                break;
            }
            onBeforeWrite(value);
            writeChunk(value);
        }
        // Collect `injectToStream()` calls stuck in an async call
        setTimeout(() => {
            onBeforeEnd();
            controllerWrapper.close();
            onEnded();
        }, 0);
    }
}
let encoder;
function encodeForWebStream(thing) {
    if (!encoder) {
        encoder = new TextEncoder();
    }
    if (typeof thing === 'string') {
        return encoder.encode(thing);
    }
    return thing;
}
