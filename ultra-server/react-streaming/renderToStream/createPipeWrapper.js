export { createPipeWrapper };
import { createDebugger } from '../utils.js';
import { createBuffer } from './createBuffer.js';
import { loadNodeStreamModule } from './loadNodeStreamModule.js';
const debug = createDebugger('react-streaming:createPipeWrapper');
async function createPipeWrapper(pipeOriginal, { onReactBug }) {
    const { Writable } = await loadNodeStreamModule();
    const { pipeWrapper, streamEnd } = createPipeWrapper();
    const bufferParams = {
        writeChunk: null
    };
    const { injectToStream, onBeforeWrite, onBeforeEnd } = createBuffer(bufferParams);
    return { pipeWrapper, streamEnd, injectToStream };
    function createPipeWrapper() {
        debug('createPipeWrapper()');
        let onEnded;
        const streamEnd = new Promise((r) => {
            onEnded = () => r();
        });
        const pipeWrapper = (writableOriginal) => {
            const writableProxy = new Writable({
                write(chunk, encoding, callback) {
                    debug('write');
                    onBeforeWrite(chunk);
                    writableOriginal.write(chunk, encoding, callback);
                },
                final(callback) {
                    debug('final');
                    onBeforeEnd();
                    writableOriginal.end();
                    onEnded();
                    callback();
                },
                destroy(err) {
                    debug(`destroy (\`!!err === ${!!err}\`)`);
                    // Upon React internal errors (i.e. React bugs), React destroys the stream.
                    if (err)
                        onReactBug(err);
                    writableOriginal.destroy(err !== null && err !== void 0 ? err : undefined);
                    onEnded();
                }
            });
            bufferParams.writeChunk = (chunk) => {
                writableOriginal.write(chunk);
            };
            writableProxy.flush = () => {
                if (typeof writableOriginal.flush === 'function') {
                    ;
                    writableOriginal.flush();
                }
            };
            pipeOriginal(writableProxy);
        };
        return { pipeWrapper, streamEnd };
    }
}
