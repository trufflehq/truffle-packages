export { SsrDataProvider };
export { useSsrData };
import React, { useContext } from 'https://npm.tfl.dev/react';
import { useStream } from './useStream.js';
import { assert, isClientSide, isServerSide } from './utils.js';
import { parse, stringify } from 'https://npm.tfl.dev/@brillout/json-s';
const Ctx = React.createContext(undefined);
function SsrDataProvider({ children }) {
    const data = {};
    return React.createElement(Ctx.Provider, { value: data }, children);
}
const className = 'react-streaming_ssr-data';
function getHtmlChunk(entry) {
    const ssrData = [entry];
    const htmlChunk = `<script class="${className}" type="application/json">${stringify(ssrData)}</script>`;
    return htmlChunk;
}
function getSsrData(key) {
    const els = Array.from(window.document.querySelectorAll(`.${className}`));
    for (const el of els) {
        assert(el.textContent);
        const data = parse(el.textContent);
        for (const entry of data) {
            assert(typeof entry.key === 'string');
            if (entry.key === key) {
                const { value } = entry;
                return { isAvailable: true, value };
            }
        }
    }
    return { isAvailable: false };
}
function useSsrData(key, asyncFn) {
    if (isClientSide()) {
        const ssrData = getSsrData(key);
        if (ssrData.isAvailable) {
            return ssrData.value;
        }
    }
    const data = useContext(Ctx);
    let entry = data[key];
    if (!entry) {
        const streamUtils = useStream();
        const promise = (async () => {
            let value;
            try {
                value = await asyncFn();
            }
            catch (error) {
                // React seems buggy around error handling; we handle errors ourselves
                entry = data[key] = { state: 'error', error };
                return;
            }
            entry = data[key] = { state: 'done', value };
            if (isServerSide()) {
                assert(streamUtils);
                streamUtils.injectToStream(getHtmlChunk({ key, value }));
            }
        })();
        entry = data[key] = { state: 'pending', promise };
    }
    if (entry.state === 'pending') {
        throw entry.promise;
    }
    if (entry.state === 'error') {
        throw entry.error;
    }
    if (entry.state === 'done') {
        return entry.value;
    }
    assert(false);
}
