# @truffle/functions

Requires Node >= 18

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
```typescript
interface EdgeFunctionHandlerParams<RuntimeDataType = unknown> {
  myceliumClient: MyceliumClient;
  request: Request;
  connInfo: ConnInfo;
  runtimeData: RuntimeDataType;
}
```