import { observable, CombinedError, TypedDocumentNode, pipe, subscribe, getClient, } from '../../deps.ts'

/*
* FIXME - replace once we upgrade the legend version of @truffle/state
*/
export function useQuerySignal<T extends object>(
  query: TypedDocumentNode<T, any>,
  variables?: any,
) {
  const signal$ = observable<T & { error: CombinedError | undefined }>(
    undefined!,
  );
  pipe(
    getClient().query(query, variables),
    subscribe((res) => {
      if (res?.data) {
        signal$.set({ ...res.data, error: undefined });
      }

      // if there's an error in the response, set the `error` observable of the signal
      // but don't void the existing `value` observable since we don't want to lose the last good value
      // and will handle errors separately through updates to the error observable
      if (res?.error) {
        signal$.set((prev) => ({ ...prev, error: res.error }));
      }
    }),
  );
  return signal$;
}
