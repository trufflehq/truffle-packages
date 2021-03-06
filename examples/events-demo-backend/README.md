# @truffle/events-demo-backend

Default backend package that people can clone to get started building a Truffle
webhook handler with Supabase Edge Functions.

**NOTE:** We can't currently have front-end and backend packages live in the
same repo due to an [issue](https://github.com/denoland/deno/issues/13389) with
the way Deno resolves `react/jsx-runtime` during bundling.

### Overview

This package holds the backend functionality for viewer generated polls that
creators would be able to install on their Truffle site/extension. Inside of
`truffle.config.mjs` there are two important fields that we use to give the
package permission to certain functionality within the Truffle API and also set
itself up when installed on a Truffle creator's org: `requestedPermissions` and
`installActionRel`.

- `requestedPermissions` allows for the definition of specific permissions to
  access protected portions of the Truffle API, documentation for permissions is
  a work in progress but you can access the raw permission directives in the
  [API Reference](https://truffle-labs.notion.site/GraphQL-API-207272de93e94ddfb1c2ba16934af72f).
- `installActionRel` is used to define a Truffle Workflow that will be invoked
  when a creator installs a package on their Org and will execute a series of
  actions during setup e.g creating any collectibles, powerups, economy actions,
  webhooks, etc.

In this example package, the installation workflow will create a custom event
topic, a collectible that users can purchase via the channel points shop or
unlock in the battle pass, and an event subscription that will trigger a webhook
to a Supabase Edge Function when a user redeems the collectible. When the
collectible is redeemed, the Edge Function will process the webhook, fetch the
user's data, and create the poll via the Truffle API.

Inside this package the code for the Supabase Edge Function lives inside the
`backend/` directory. Eventually under the package model, the idea is to have
all of the code and functionality for the package to live in the same place so
on top of the serverless function and installation steps, we'd also have the
front-end code (overlays and extension mappings) that the creator would
configure to display the viewer generated polls through the extension or through
an OBS overlay.

### Getting Started

This guide will walk you through how to create a backend Truffle package that
will receive webhooks from a collectible created by the package and call the
Truffle Graphql API to create a poll.

- Start off by forking this demo package with
  `truffle-cli fork @truffle/events-demo-backend <package name>`. This command
  will setup a new backend package forked off this example. **Note: \<package
  name\> must be unique within your development org**
- Next, you should define the installation workflow inside the
  `installActionRel` in `truffle.config.mjs`. Inside the `installActionRel` you
  will need to update:
  - The EventTopic slug in the EventTopicUpsert query to signify the unique
    event topic for your package
  - Update the `eventTopicSlug` fields in the `CollectibleUpsert` and
    `EventSubscriptionUpsert` queries to the slug your created in the previous
    step.
  - Update the collectible slug in the CollectibleUpsert query to a unique
    collectible slug.
- After you've defined the install steps, the next step is to setup and deploy
  the Supabase Edge function which will handle the custom webhook triggered
  during the viewer poll collectible redemption. Run through the edge function
  specific steps in the [`backend/README.md`](./backend/README.md) and deploy
  the edge function so the edge function can verify the event subscription
  during package installation.
- Update the `endpoint` attribute of the EventSubscription installation step to
  the public url of your edge function.
- **Deploy the package version. `truffle-cli deploy`**
  - _The package install flow (permissions & installAction) uses the deployed
    version of your package_
- Install the package into the front-end package you've already setup with
  `truffle-cli install @your-org/your-package@latest`.
  - Where `@truffle/events-demo-backend@latest` corresponds to your package path
    `@orgSlug/<package name>@<packageVersion semver>`.
  - You can also just install the lastest version of your package by grabbing
    the package name from `truffle.config.mjs` and appending `@latest` like in
    the example above.
  - *If you don't have a separate frontend package, you'll still need to run the
    truffle-cli install command in one of your other packages (you can also
    create a dummy test package). This will create a custom role and bot user
    that gives your package the requested permissions inside of your org.
- To test out the package's backend functionality grab the created collectible.
  Here's a Graphql query you can use to fetch all of the org's redeemable
  collectibles (**Note: Make sure you've set the Supabase secrets before testing
  out the functionality**):

```graphql
query CollectibleConnectionQuery ($input: CollectibleConnectionInput, $first: Int, $after: String, $last: Int, $before: String) {
    collectibleConnection(input: $input, first: $first, after: $after, last: $last, before: $before) {
        pageInfo {
            endCursor
            hasNextPage
            startCursor
            hasPreviousPage
        }
        nodes {
            id
            orgId
            slug
            name
            fileRel {
                fileId
                fileObj {
                    cdn
                    ext
                    prefix
                }
            }
            type
            targetType
            data {
                category
                redeemType
                description
                redeemData
            }
        }
    }
}
```

```json
{
  "input": {
    "type": "redeemable"
  },
  "first": 100
}
```

Grab the ID of the collectible created from the installation steps.

- For the next step you'll need to increment the number of owned collectibles
  for a user so they can redeem the package collectible. To get a userId to use
  in the following query you can query for an orgUserConnection:

```graphql
query OrgUserConnectionQuery ($input: OrgUserConnectionInput!) {
    orgUserConnection(input: $input) {
        totalCount
        nodes {
           userId
            orgId
            name
        }
    }
}
```

- Next, give a user the package collectible by calling the
  `ownedCollectibleIncrement` mutation for a user. Here's the Graphql query to
  increment a user's owned collectible:

```graphql
mutation OwnedCollectibleIncrement ($input: OwnedCollectibleIncrementInput!) {
    ownedCollectibleIncrement(input: $input) {
        collectible {
            id
            name
            type
        }

    }
}
```

```json
{
  "input": {
    "collectibleId": "<package collectibleId>",
    "userId": "<userId>",
    "count": 100
  }
}
```

- Once the user has been given the collectible, redeem the collectible and
  verify that the edge function was called and a poll was created. To redeem a
  user's owned collectible, you can use the following Graphql query:

```graphql
mutation OwnedCollectibleRedeem ($input: OwnedCollectibleRedeemInput) {
    ownedCollectibleRedeem(input: $input) {
        redeemResponse
        redeemError
    }
}
```

```json
{
  "input": {
    "userId": "<userId>",
    "collectibleId": "<collectibleId>",
    "additionalData": {
      "question": "IT WORKING",
      "options": [
        {
          "text": "9:00pm"
        },
        {
          "text": "9:00am"
        }
      ]
    }
  }
}
```

To verify that the poll was successfully created use the following Graphql
Query:

```graphql
query PollConnectionQuery ($first: Int, $after: String, $last: Int, $before: String) {
    pollConnection(first: $first, after: $after, last: $last, before: $before) {
        pageInfo {
            endCursor
            hasNextPage
            startCursor
            hasPreviousPage
        }
        nodes {
            id
            orgId
            question
            options {
                text
                index
            }
            time
        }
    }
}
```

### Scripts

- `deno task deploy-fn`: This script will deploy the Supabase Edge Function,
  update this to the name of the edge function in your project
- `deno task deploy-pkg`: This script will deploy the Truffle package (wrapper
  around `truffle-cli deploy`)
