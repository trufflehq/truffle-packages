# @truffle/song-suggestions

## Overview
Package for viewers to submit song submissions w/ mod approval that will be turned into a poll that the rest of chat will vote on.

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
