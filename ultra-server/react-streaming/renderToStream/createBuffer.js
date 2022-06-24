export { createBuffer };
import { assert, assertUsage, createDebugger } from '../utils.js';
const debug = createDebugger('react-streaming:buffer');
function createBuffer(bufferParams) {
    const buffer = [];
    let state = 'UNSTARTED';
    let writePermission = null; // Set to `null` because React fails to hydrate if something is injected before the first react write
    return { injectToStream, onBeforeWrite, onBeforeEnd };
    function injectToStream(chunk) {
        assertUsage(state !== 'ENDED', `Cannot inject following chunk after stream has ended: \`${chunk}\``);
        debug('injectToStream:', chunk);
        buffer.push(chunk);
        flushBuffer();
    }
    function flushBuffer() {
        if (!writePermission) {
            return;
        }
        if (buffer.length === 0) {
            return;
        }
        if (state !== 'STREAMING') {
            assert(state === 'UNSTARTED');
            return;
        }
        buffer.forEach((chunk) => {
            const { writeChunk } = bufferParams;
            assert(writeChunk);
            writeChunk(chunk);
        });
        buffer.length = 0;
    }
    function onBeforeWrite(chunk) {
        state === 'UNSTARTED' && debug('>>> START');
        debug(`react write${!writePermission ? '' : ' (allowed)'}:`, String(chunk));
        state = 'STREAMING';
        if (writePermission) {
            flushBuffer();
        }
        if (writePermission == true || writePermission === null) {
            writePermission = false;
            debug('writePermission =', writePermission);
            setTimeout(() => {
                debug('>>> setTimeout()');
                writePermission = true;
                debug('writePermission =', writePermission);
                flushBuffer();
            });
        }
    }
    function onBeforeEnd() {
        writePermission = true;
        debug('writePermission =', writePermission);
        flushBuffer();
        assert(buffer.length === 0);
        state = 'ENDED';
        debug('>>> END');
    }
}
