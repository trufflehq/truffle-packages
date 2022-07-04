# @truffle/events-demo-backend

Default backend package that people can clone to get started building a Truffle webhook handler with
Supabase Edge Functions.

**NOTE:** We can't currently have front-end and backend packages live in the same repo
due to an [issue](https://github.com/denoland/deno/issues/13389) with the way Deno resolves `react/jsx-runtime`
during bundling.

### Overview

This package holds the backend functionality for viewer generated polls that creators would be able to install on their Truffle site/extension. Inside of `truffle.config.mjs` there are two important fields that we use to give the package permission to certain functionality within the Truffle API and also set itself up when installed on a Truffle creator's org: `requestedPermissions` and `installActionRel`. `requestedPermissions` allows for the definition of specific permissions to access protected portions of the Truffle API, documentation for permissions is a work in progress but you can access the raw permission directives in the API Reference in Notion. `installActionRel` is used to define a Truffle Workflow that will be invoked when a creator installs a package on their Org and will execute a series of actions during setup e.g creating any collectibles, powerups, economy actions, webhooks, etc. In this example package, the installation workflow will create a custom event topic, a collectible that user's can purchase via the channel points shop or unlock in the battle pass, and an event subscription that will trigger a webhook to a Supabase Edge Function when a user redeems the collectible to create a poll where the Edge Function will process the webhook, fetch the user's data, and create the poll via the Truffle API. Inside this package the code for the Supabase Edge Function lives inside the `backend/` directory. Eventually under the package model, the idea is to have all of the code and functionality for the package to live in the same place so on top of the serverless function and installation steps, we'd also have the front-end code (overlays and extension mappings) that the creator would configure to display the viewer generated polls through the extension or through an OBS overlay.


### Getting Started

This guide will walk you through how to create a backend Truffle package that will receive webhooks from a collectible created by the package and call the Truffle Graphql API to create a poll.

* Start off by forking this demo package with `truffle-cli fork @truffle/events-demo-backend <package name>`. This command will setup a new backend package forked off this example. **Note: <package name> must be unique for the devlopment org**
* After you've forked the package, the next step is to setup and deploy the Supabase Edge function which will handle the custom webhook triggered during the viewer poll collectible redemption. Run through the edge function specific steps in the [`backend/README.md`](./backend/README.md) and deploy the edge function so the edge function can verify the event subscription during package installation.
* Next, you should define the installation workflow inside the `installActionRel` in `truffle.config.mjs`. **If you're forking directly from this package note that collectibles and event topics must be unique at the Org level, so rename `viewer-create-poll` to something else specific to your package.
* Update the `endpoint` attribute of the EventSubscription installation step to the public url of your edge function.
* Deploy the package version once you're happy with it. **The package install flow uses the deployed version of your package**. `truffle-cli deploy`
* Install the package with `truffle-cli install @truffle/events-demo-backend@latest`. Where `@truffle/events-demo-backend@latest` corresponds to your package path `@orgSlug/<package name>@<packageVersion semver>`. You can also just install the lastest version of your package by grabbing the package name from `truffle.config.mjs` and appending `@latest` like in the example above.