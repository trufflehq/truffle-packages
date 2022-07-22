# @truffle/mashing-minigame

## Overview
Full stack example of a Truffle package that contains all of the required functionality to manage a round based minigame
that uses OrgUserCounters, the Events API, the User Management API with a custom backend, and a leaderboard.

The backend functionality lives inside a Supabase Edge Function which will handle the round timing and updating state in the 
Truffle API.

On the front-end there are currently 2 routes:
* `/`: The root will be the base extension mapping that viewers use to mash a button
* `/admin`: This is the route use to start/end a round

### Admin Flow
To start a mashing round, the admin UI updates several pieces of state:
1. Creates an OrgUserCounterType
2. Updates the package's config for the org in KeyValue
3. Executes an action to forward the config data to the edge function which stores the updated
config in the Supabase Postgres instance that the increment action will check to see if the round is still
active.

### Increment Flow
1. The front-end of the increment side of the flow will poll the package config for the org to see if 
there is an active round, if there is—it'll start a timer that'll show the user how much time is left in the 
round.
2. While a round is active, each click by the user will call the `actionExecute` mutation to call a webhook
to the edge function to increment the user's OrgUserCounter for the current round if there is still time remaining in the round.

### Permissions/Roles
Since the Truffle API allows any authenticated user to call the `actionExecute` mutation you'll have to manage permissions when the backend service receives the webhook by checking the roles and permissions of the orgUser sent in the webhook. In this example, we make sure that the orgUser that calls the `/admin/start` endpoint has the Truffle admin role before we update the config in Supabase. We also verify that the increment call is coming from an action executed by a Truffle user that has the everyone role.