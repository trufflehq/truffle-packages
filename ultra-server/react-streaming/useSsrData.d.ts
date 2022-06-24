export { SsrDataProvider };
export { useSsrData };
import React from 'react';
declare type Data = Record<string, Entry>;
declare type Entry = {
    state: 'pending';
    promise: Promise<unknown>;
} | {
    state: 'error';
    error: unknown;
} | {
    state: 'done';
    value: unknown;
};
declare function SsrDataProvider({ children }: {
    children: React.ReactNode;
}): React.FunctionComponentElement<React.ProviderProps<Data>>;
declare function useSsrData<T>(key: string, asyncFn: () => Promise<T>): T;
