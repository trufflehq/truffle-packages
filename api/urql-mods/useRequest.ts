import { DocumentNode } from "https://npm.tfl.dev/graphql";
import { useMemo, useRef } from "https://npm.tfl.dev/react";
import {
  createRequest,
  GraphQLRequest,
  TypedDocumentNode,
} from "https://npm.tfl.dev/@urql/core@^3.0.0";

/** Creates a request from a query and variables but preserves reference equality if the key isn't changing */
export function useRequest<Data = any, Variables = object>(
  query: string | DocumentNode | TypedDocumentNode<Data, Variables>,
  variables?: Variables,
): GraphQLRequest<Data, Variables> {
  const prev = useRef<undefined | GraphQLRequest<Data, Variables>>(undefined);

  return useMemo(() => {
    const request = createRequest<Data, Variables>(query, variables);
    // We manually ensure reference equality if the key hasn't changed
    if (prev.current !== undefined && prev.current.key === request.key) {
      return prev.current;
    } else {
      prev.current = request;
      return request;
    }
  }, [query, variables]);
}
