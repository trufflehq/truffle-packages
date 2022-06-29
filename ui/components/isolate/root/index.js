import { useContext } from 'https://npm.tfl.dev/react';
import { decamelize } from 'https://npm.tfl.dev/humps@2';
import create from './core.js';
import * as utils from './utils.js';

const tags = new Map();

export function useShadowRoot() {
    return useContext(utils.Context);
}

export function createProxy(
    target = {},
    id = 'core',
    render = ({ children }) => children,
) {
    return new Proxy(target, {
        get: function get(_, name) {
            const tag = decamelize(name, { separator: '-' });
            const key = `${id}-${tag}`;

            if (!tags.has(key)) tags.set(key, create({ tag, render }));
            return tags.get(key);
        },
    });
}

export default createProxy();