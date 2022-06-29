// https://github.com/austinhallock/ReactShadow
// modified so refs are immediately available in useEffects
// (content is mounted even if portal is not ready)
import { createContext } from 'https://npm.tfl.dev/react';

export const Context = createContext(null);

export function handleError({ error, styleSheets, root }) {
    switch (error.name) {
        case 'NotSupportedError':
            styleSheets.length > 0 && (root.adoptedStyleSheets = styleSheets);
            break;
        default:
            throw error;
    }
}