# @ludwig/song-suggestions

## Overview
Package for viewers to submit song submissions w/ mod approval that will be turned into a poll that the rest of chat will vote on.

Deployments:

* [Admin](https://package-version-b3025840-108a-11ed-82b3-361ddfbab750.truffle.site/admin)
* [Voting](https://package-version-b3025840-108a-11ed-82b3-361ddfbab750.truffle.site)
* [Overlay](https://package-version-b3025840-108a-11ed-82b3-361ddfbab750.truffle.site/poll-overlay)

There are several different components to this package.

### Viewer Submissions
The flow begins when users purchase a Playlist Song Submission collectible from the channel points shop. Viewers can then redeem the collectible and submit a song via valid YouTube link. 

### Moderator Review
When a viewer submits a song, it'll perform some validation and make a couple requests to grab data about the submitter and the song before creating a Submission row in our Supabase `submissions` table. Mods will then be able to approve/deny valid submissions under the 'Submissions' tab to ensure that the songs played on stream are appropriate and don't have any copyright violations. Once a submission is approved, it'll show up under the 'Approved' tab where an admin can then either queue a song from the list or select a random approved submission.

### Polls
Once the admin has queued an approved submission, the admin will be presented with an option to start the poll which will create the poll in Truffle and the poll voting extension mapping will appear over chat where viewers can vote on whether or not a song should be added to the stream playlist. After a poll is created the most recent polls will be visible under the 'Poll History' tab to the team can keep track of poll results and follow up on submission bans if chat doesn't like their submission.

## Routes
* `/`: this is the poll voting extension mapping
* `/admin`: route for the admin dashboard.
* `poll-overlay`: poll result overlay that ludwig can use in obs

## Extension Mapping
When we're ready to light up you can run a modified version of the insert query I used to create the extension mapping on the testing channel. 

Note to get this to work I just picked a random UUID for the `componentInstanceId` and then added the sporocarp link in the `data.iframeUrl` field which the resolver looks for while fetching extension mappings.

```
INSERT INTO "spore"."extension_mappings_by_id" (
  "id", "sourceType", "sourceId", "orgId", 
  "componentInstanceId", "defaultDomParentSpec", 
  "defaultLayoutConfigSteps", "domAction", 
  "iframeQuerySelector", "maxExtensionVersion", 
  "minExtensionVersion", "querySelector", 
  "slug", "status", "data"
) 
VALUES 
  (
    43779a80-1085-11ed-a89c-af102273ca24, 'url', 'https://www.youtube.com/watch?v=Xe5KJINZGRA', 
    8e35b570-6c2f-11ec-bade-b32a8d305590, 48b946b0-1085-11ed-a89c-af102273ca24, 
    NULL, '[{"action": "querySelector","value": "#chat"},{"action": "setStyle","value":"{\"position\":\"relative\"}"},{"action":"appendSubject"}]', 
    NULL, NULL, NULL, NULL, NULL, 'song-suggestions', 
    'published', '{"iframeUrl":  "https://package-version-1037cca0-106f-11ed-825c-efcdfe229775.truffle.site/"}'
  );
```

### Remaining Work
* We should bump up the Supabase account to make sure we have enough bandwidth during the event
* Should take a look at the front-end perf in the Submissions List and use some sort of virtualization and increase the list size (right now we're just fetching the latest 50 submissions or so and mods will probably need more than that)
* One of the mods requested putting a link to the song in the viewer poll ext. mapping. Can grab that data from `poll.data.submission.link`.
* Tim requested a way to block user's from submitting, don't think we should spend time implementing but adding for visibility in case he asks.
* Luda asked for less padding/white space in the UI so they could see more songs on the page.
* Make sure Ludwig can login to the Admin panel before the event
* The poll overlay is the same one I used for the viewer polls example. Should probably spruce that up so it looks better on stream. Also need to make sure the hooks is working properly and actually updates when a the latest poll states changes (it's using the same hook as the other components so should be fine but haven't tested it too much)