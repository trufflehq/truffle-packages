# @truffle/functions

Utilities for creating Truffle Edge Functions.

## Importing

```typescript
import * as TruffleFunctions from "https://tfl.dev/@truffle/functions@~0.0.4/mod.ts";
```

## exports

### functions

- `serveTruffleEdgeFunction<RuntimeDataType>(params: EdgeFunctionParams)`
  - Use this as the entry point to your edge function.
- `makeResp(statusCode: number, body: object)`
  - A convenience method that generates an HTTP response.
- `graphqlReq<T = unknown>(query: string, variables: Record<string, unknown>, options: MyceliumOptions)`
  - Used for making graphql requests. It's not recommended to use this directly; instead use an instance of `MyceliumClient`.

### interfaces/classes

- `MyceliumClient`
  - An object that facilitates communication with the Mycelium API.
  - Use `MyceliumClient.query<T = unknown>(queryStr: string, variables?: Record<string, unknown>)` to make a request.

- `EdgeFunctionHandlerParams`
  - `myceliumClient` uses [graphql-request](https://deno.land/x/graphql_request@v4.1.0) under the hood; it's an instance of `GraphQLClient`.
```typescript
interface EdgeFunctionHandlerParams<RuntimeDataType = unknown> {
  myceliumClient: GraphQLClient;
  request: Request;
  connInfo: ConnInfo;
  runtimeData: RuntimeDataType;
}
```

## example

This example takes an org user id from the passed runtime data and returns an object with the org user's name.

```typescript
import { makeResp, serveTruffleEdgeFunction } from "https://tfl.dev/@truffle/functions@~0.0.4/mod.ts";

interface MyRuntimeData {
  orgUserId: string;
}

const ORG_USER_QUERY = `
  query OrgUser($orgUserId: String) {
    orgUser(input: { id: $id }) {
      id
      name
    }
  }
`

serveTruffleEdgeFunction<InstallRouteRuntimeData>(
  async ({ myceliumClient, runtimeData }) => {
    
    // grab the org user id from runtimeData
    const { orgUserId } = runtimeData;

    // query Mycelium for the org user
    const { orgUser } = await myceliumClient.request(
      ORG_USER_QUERY,
      { orgUserId }
    );

    // return the org user
    return makeResp(200, { orgUser });
  }
);
```