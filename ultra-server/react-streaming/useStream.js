import React, { useContext } from 'https://npm.tfl.dev/react';
import { isClientSide } from './utils.js';
export { useStream };
export { StreamProvider };
const StreamContext = React.createContext(null);
const StreamProvider = StreamContext.Provider;
function useStream() {
    if (isClientSide()) {
        return null;
    }
    const streamUtils = useContext(StreamContext);
    return streamUtils;
}
