export function isServerSide() {
    return !isClientSide();
}
export function isClientSide() {
    return typeof window !== 'undefined' && typeof (window === null || window === void 0 ? void 0 : window.getComputedStyle) === 'function';
}
export function assert(condition, debugInfo) {
    if (condition)
        return;
    const debugStr = debugInfo && (typeof debugInfo === 'string' ? debugInfo : '`' + JSON.stringify(debugInfo) + '`');
    throw new Error([
        '[react-streaming][Bug] You stumbled upon a bug in the source code of `react-streaming`.',
        'Reach out at https://github.com/brillout/react-streaming/issues/new and include this error stack',
        '(the error stack is usually enough to fix the problem).',
        debugStr && `(Debug info for the maintainers: ${debugStr})`
    ]
        .filter(Boolean)
        .join(' '));
}
export function assertUsage(condition, msg) {
    if (condition)
        return;
    throw new Error('[react-streaming][Wrong Usage] ' + msg);
}
export function assertWarning(condition, msg) {
    if (condition)
        return;
    console.warn('[react-streaming][Warning] ' + msg);
}
import debug from 'https://npm.tfl.dev/debug';
export function createDebugger(namespace, options = {}) {
    let DEBUG;
    let DEBUG_FILTER;
    // - `process` can be undefined in edge workers
    // - We want bundlers to be able to statically replace `process.env.*`
    try {
        DEBUG = process.env.DEBUG;
    }
    catch { }
    try {
        DEBUG_FILTER = process.env.DEBUG_FILTER_REACT_STREAMING;
    }
    catch { }
    try {
        DEBUG_FILTER || (DEBUG_FILTER = process.env.DEBUG_FILTER);
    }
    catch { }
    const log = debug(namespace);
    const { onlyWhenFocused } = options;
    const focus = typeof onlyWhenFocused === 'string' ? onlyWhenFocused : namespace;
    return (msg, ...args) => {
        if (DEBUG_FILTER && !msg.includes(DEBUG_FILTER)) {
            return;
        }
        if (onlyWhenFocused && !(DEBUG === null || DEBUG === void 0 ? void 0 : DEBUG.includes(focus))) {
            return;
        }
        log(msg, ...args);
    };
}
