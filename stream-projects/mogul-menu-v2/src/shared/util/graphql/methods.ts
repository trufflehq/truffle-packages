import { OperationContext } from "../../../deps.ts";
import { truffleApp } from "../truffle/truffle-app.ts";

export function getClient() {
  return truffleApp.gqlClient;
}

export function query(
  query: string,
  variables?: Record<string, unknown>,
  operationContext?: OperationContext,
) {
  return getClient().query(query, variables, operationContext as any)
    .toPromise();
}

export function mutation(query: string, variables: Record<string, unknown>) {
  return getClient().mutation(query, variables).toPromise();
}
