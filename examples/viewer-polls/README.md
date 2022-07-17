# @truffle/viewer-polls

## Overview
Full stack example of a Truffle package that contains all of the required functionality to manage and administer viewer
polls structured through collectible redemptions.


The backend functionality lives inside a Supabase Edge Function which will handle the collectible redemption event and call
the Truffle API to create a poll.

On the front-end there are currently 3 routes:
* `/`: The root will be the base extension mapping that viewers use to vote and view the results of the polls
* `/create`: This is the extension mapping that can be used to create the poll
* `/poll-overlay`: This is a page the streamer can use to pull the viewer generated polls into a Brower Source overlay in OBS
* `/poll/:id`: This page contains scaffolding you could use to redirect to a page where you could manage a specific poll


## Future Work
* For any sort of viewer generated input there will likely be a need for some sort of intermediary approval step so mods can accept or reject submissions before publishing the polls for everybody to see.
* Still need to add a lot of types. The npm.tfl.dev import doesn't currently pull in types for React so once we get that fixed we shoud
flush out the front-end types.
