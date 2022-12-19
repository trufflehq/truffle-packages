import { DocumentNode } from "https://npm.tfl.dev/graphql";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "https://npm.tfl.dev/react";
import { pipe, toPromise } from "https://npm.tfl.dev/wonka@^6.0.0";

import {
  CombinedError,
  createRequest,
  Operation,
  OperationContext,
  OperationResult,
  TypedDocumentNode,
} from "https://npm.tfl.dev/@urql/core@^3.0.0";

import { getClient } from "../urql-client.ts";
import { initialState } from "./state.ts";

export interface UseMutationState<Data = any, Variables = object> {
  fetching: boolean;
  stale: boolean;
  data?: Data;
  error?: CombinedError;
  extensions?: Record<string, any>;
  operation?: Operation<Data, Variables>;
}

export type UseMutationResponse<Data = any, Variables = object> = [
  UseMutationState<Data, Variables>,
  (
    variables?: Variables,
    context?: Partial<OperationContext>,
  ) => Promise<OperationResult<Data, Variables>>,
];

export function useMutation<Data = any, Variables = object>(
  query: DocumentNode | TypedDocumentNode<Data, Variables> | string,
): UseMutationResponse<Data, Variables> {
  const isMounted = useRef(true);
  const client = getClient();

  const [state, setState] = useState<UseMutationState<Data, Variables>>(
    initialState,
  );

  const executeMutation = useCallback(
    (variables?: Variables, context?: Partial<OperationContext>) => {
      setState({ ...initialState, fetching: true });

      return pipe(
        client.executeMutation<Data, Variables>(
          createRequest<Data, Variables>(query, variables),
          context || {},
        ),
        toPromise,
      ).then((result) => {
        if (isMounted.current) {
          setState({
            fetching: false,
            stale: !!result.stale,
            data: result.data,
            error: result.error,
            extensions: result.extensions,
            operation: result.operation,
          });
        }
        return result;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [client, query, setState],
  );

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return [state, executeMutation];
}
