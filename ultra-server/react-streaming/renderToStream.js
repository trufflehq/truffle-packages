export { renderToStream };
export { disable };
import React from 'https://npm.tfl.dev/react';
import ReactDOMServer, { version as reactDomVersion } from 'https://npm.tfl.dev/react-dom/server';
import { SsrDataProvider } from './useSsrData.js';
import { StreamProvider } from './useStream.js';
import { createPipeWrapper } from './renderToStream/createPipeWrapper.js';
import { createReadableWrapper } from './renderToStream/createReadableWrapper.js';
import { resolveSeoStrategy } from './renderToStream/resolveSeoStrategy.js';
import { assert, assertUsage, createDebugger } from './utils.js';
import { nodeStreamModuleIsAvailable } from './renderToStream/loadNodeStreamModule.js';
const debug = createDebugger('react-streaming:flow');
assertReact();
const globalConfig = (globalThis.__react_streaming = globalThis
    .__react_streaming || {
    disable: false
});
function disable() {
    globalConfig.disable = true;
}
async function renderToStream(element, options = {}) {
    console.log('o1', options)
    var _a, _b;
    element = React.createElement(SsrDataProvider, null, element);
    let injectToStream;
    element = React.createElement(StreamProvider, { value: { injectToStream: (chunk) => injectToStream(chunk) } }, element);
    const disable = globalConfig.disable || ((_a = options.disable) !== null && _a !== void 0 ? _a : resolveSeoStrategy(options).disableStream);
    const webStream = (_b = options.webStream) !== null && _b !== void 0 ? _b : !(await nodeStreamModuleIsAvailable());
    debug(`disable === ${disable} && webStream === ${webStream}`);
    let result;
    if (!webStream) {
        console.log('node stream')
        result = await renderToNodeStream(element, disable, options);
    }
    else {
        result = await renderToWebStream(element, disable, options);
    }
    injectToStream = result.injectToStream;
    debug('promise `await renderToStream()` resolved');
    return result;
}
async function renderToNodeStream(element, disable, options) {
    var _a;
    debug('creating Node.js Stream Pipe');
    let onAllReady;
    const allReady = new Promise((r) => {
        onAllReady = () => r();
    });
    let onShellReady;
    const shellReady = new Promise((r) => {
        onShellReady = () => r();
    });
    let didError = false;
    let firstErr = null;
    let reactBug = null;
    const onError = (err) => {
        debug('[react] onError() / onShellError()');
        didError = true;
        firstErr !== null && firstErr !== void 0 ? firstErr : (firstErr = err);
        onShellReady();
        afterReactBugCatch(() => {
            var _a;
            // Is not a React internal error (i.e. a React bug)
            if (err !== reactBug) {
                (_a = options.onBoundaryError) === null || _a === void 0 ? void 0 : _a.call(options, err);
            }
        });
    };
    const renderToPipeableStream = (_a = options.renderToPipeableStream) !== null && _a !== void 0 ? _a : (await import('https://npm.tfl.dev/react-dom/server')).renderToPipeableStream;
    assertReactImport(renderToPipeableStream, 'renderToPipeableStream');
    const { pipe: pipeOriginal } = renderToPipeableStream(element, {
        onShellReady() {
            debug('[react] onShellReady()');
            onShellReady();
        },
        onAllReady() {
            debug('[react] onAllReady()');
            onShellReady();
            onAllReady();
        },
        onShellError: onError,
        onError
    });
    let promiseResolved = false;
    const { pipeWrapper, injectToStream, streamEnd } = await createPipeWrapper(pipeOriginal, {
        onReactBug(err) {
            debug('react bug');
            didError = true;
            firstErr !== null && firstErr !== void 0 ? firstErr : (firstErr = err);
            reactBug = err;
            // Only log if it wasn't used as rejection for `await renderToStream()`
            if (reactBug !== firstErr || promiseResolved) {
                console.error(reactBug);
            }
        }
    });
    await shellReady;
    if (didError)
        throw firstErr;
    if (disable)
        await allReady;
    if (didError)
        throw firstErr;
    promiseResolved = true;
    return {
        pipe: pipeWrapper,
        readable: null,
        streamEnd: wrapStreamEnd(streamEnd, didError),
        injectToStream
    };
}
async function renderToWebStream(element, disable, options) {
    var _a;
    debug('creating Web Stream Pipe');
    let didError = false;
    let firstErr = null;
    let reactBug = null;
    const onError = (err) => {
        didError = true;
        firstErr = firstErr || err;
        afterReactBugCatch(() => {
            var _a;
            // Is not a React internal error (i.e. a React bug)
            if (err !== reactBug) {
                (_a = options.onBoundaryError) === null || _a === void 0 ? void 0 : _a.call(options, err);
            }
        });
    };
    const renderToReadableStream = (_a = options.renderToReadableStream) !== null && _a !== void 0 ? _a : (await import('https://npm.tfl.dev/react-dom/server')).renderToReadableStream;
    assertReactImport(renderToReadableStream, 'renderToReadableStream');
    console.log('opt', options);
    const readableOriginal = await renderToReadableStream(element, { onError, ...options });
    const { allReady } = readableOriginal;
    let promiseResolved = false;
    // Upon React internal errors (i.e. React bugs), React rejects `allReady`.
    // React doesn't reject `allReady` upon boundary errors.
    allReady.catch((err) => {
        debug('react bug');
        didError = true;
        firstErr = firstErr || err;
        reactBug = err;
        // Only log if it wasn't used as rejection for `await renderToStream()`
        if (reactBug !== firstErr || promiseResolved) {
            console.error(reactBug);
        }
    });
    if (didError)
        throw firstErr;
    if (disable)
        await allReady;
    if (didError)
        throw firstErr;
    const { readableWrapper, streamEnd, injectToStream } = createReadableWrapper(readableOriginal);
    promiseResolved = true;
    return {
        readable: readableWrapper,
        pipe: null,
        streamEnd: wrapStreamEnd(streamEnd, didError),
        injectToStream
    };
}
// Needed for the hacky solution to workaround https://github.com/facebook/react/issues/24536
function afterReactBugCatch(fn) {
    setTimeout(() => {
        fn();
    }, 0);
}
function wrapStreamEnd(streamEnd, didError) {
    return (streamEnd
        // Needed because of the `afterReactBugCatch()` hack above, otherwise `onBoundaryError` triggers after `streamEnd` resolved
        .then(() => new Promise((r) => setTimeout(r, 0)))
        .then(() => !didError));
}
// To debug wrong peer dependency loading:
//  - https://stackoverflow.com/questions/21056748/seriously-debugging-node-js-cannot-find-module-xyz-abcd
//  - https://stackoverflow.com/questions/59865584/how-to-invalidate-cached-require-resolve-results
function assertReact() {
    const versionMajor = parseInt(reactDomVersion.split('.')[0], 10);
    assertUsage(versionMajor >= 18, `\`react-dom@${reactDomVersion}\` was loaded, but react-streaming only works with React version 18 or greater.`);
    assert(typeof ReactDOMServer.renderToPipeableStream === 'function' ||
        typeof ReactDOMServer.renderToReadableStream === 'function');
}
function assertReactImport(fn, fnName) {
    assertUsage(fn, [
        'Your environment seems broken.',
        `(Could not import \`${fnName}\` from \`react-dom/server\`).`,
        'Create a new GitHub issue at https://github.com/brillout/react-streaming to discuss a solution.'
    ].join(' '));
    assert(typeof fn === 'function');
}
