@trufflehq/mothertree-client
---

This is the official client for Truffle's Mothertree API. It can be used both on the server and in the browser.

## Installation

```bash
npm install @trufflehq/mothertree-client
```

## Basic usage

```ts
import { MothertreeClient } from "@trufflehq/mothertree-client";

const client = new MothertreeClient({
  // pass in the user's access token if you have one;
  // to ensure compatibility with the browser,
  // this library does not verify the token,
  // so if you're on the server, you should
  // do this with a library like `jsonwebtoken`
  accessToken: 'your-access-token',

  // optional;
  // defaults to 'https://mothertree.staging.bio/graphql'
  url: 'https://mothertree.staging.bio/graphql'
});

// Get the current user's id
client.userId

// Get the current user's member id
client.orgMemberId

// Get the id of the org that the current user is interacting with
client.orgId

// Get the current user's member info
await client.getOrgMember()

// Get the current org's info
await client.getOrg()

// Get the current user's roles in the current org
await client.getRoles()
```
