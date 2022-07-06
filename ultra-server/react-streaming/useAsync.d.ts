export { useAsync };
declare function useAsync<T>(asyncFn: () => Promise<T>): T;
