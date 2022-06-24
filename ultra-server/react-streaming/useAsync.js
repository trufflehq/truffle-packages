export { useAsync };
import { useId } from 'https://npm.tfl.dev/react';
import { useSsrData } from './useSsrData.js';
function useAsync(asyncFn) {
    const id = useId();
    // TODO: throw new Error('Only one `useAsync()` hook can be used per component')
    return useSsrData(id, asyncFn);
}
