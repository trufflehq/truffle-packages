Truffle SDK
---

The official javascript SDK for Truffle. This SDK is primarily designed to be used in an embed. If you don't know what that is, you might want to take a look at [the docs](https://docs.truffle.vip/truffle-embeds/getting-started).

## Installation

```bash
npm install @trufflehq/sdk@alpha
```

## Basic usage

```ts
// main script file
import { subscribeToAuth } from "@trufflehq/sdk";

// subscribe to auth events;
// whenever the user logs in or out,
// the callback will be called with
// an instance of TruffleApp. This
// is probably a good place to put
// the code that renders your app
// so that it re-renders when the
// user logs in or out.
// See https://github.com/trufflehq/truffle-packages/blob/af-sdk-refactor-1/npm/sdk/examples/react-auth/src/main.tsx as an example
subscribeToAuth((truffleApp) => {
  // render your app here
  // e.g. ReactDOM.render();

  // you can check if the user is authenticated
  truffleApp.mtClient.isAuthenticated

  // you can check if the current user is anonymous
  truffleApp.mtClient.isAnon
});
```

Elsewhere in your app, you can use the Mothertree Client to get info about the current user and org:

```ts
import { getMtClient } from "@trufflehq/sdk";

const client = getMtClient();

// Get the current user's member info
await client.getOrgMember();
```

A full example can be found [here](./examples/react-auth/).

More info about the mothertree client can be found [here](../mothertree-client/).