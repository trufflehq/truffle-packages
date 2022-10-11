# truffle-packages

## Repository Map

> More information available in package README

<!-- START PACKAGES -->

**Packages**\
[@truffle/state@`0.0.2`](./state) - Signals coupled with Legend state for React\
[@truffle/distribute@`2.0.5`](./distribute) - Vendored packages with minor
modifications\
[@truffle/third-party-oauth@`0.0.31`](./third-party-oauth) - Login and other
auth utilities\
[@truffle/events@`0.0.1`](./events) - Utilities for handling webhooks from
Truffle\
[@truffle/config@`1.0.0`](./config) - Default package configuration\
[@truffle/context@`1.0.0`](./context) - Utilities for context in React\
[@truffle/router@`1.0.0`](./router) - Router for Truffle package routes\
[@truffle/api@`0.1.12`](./api) - Hooks and functions for interacting with
Truffle APIs\
[@truffle/ui@`0.1.8`](./ui) - Unified UI\
[@truffle/utils@`0.0.21`](./utils) - Browser & Node utilities\
[@truffle/youtube-js@`0.5.9`](./youtube-js) - Truffle fork of
[Youtube.js](https://github.com/LuanRT/YouTube.js)\
[@truffle/global-context@`1.0.0`](./global-context) - Truffle Global Context for
React

**Examples**\
[@truffle/events-demo-backend@`0.0.12`](./examples/events-demo-backend) -
[Events](../../events) demo\
[@truffle/create-react-project@`0.5.6`](./examples/create-react-project) -
Truffle project template\
[@truffle/song-suggestions@`0.0.24`](./examples/song-suggestions) - Song
Suggestions Suite\
[@truffle/viewer-polls@`0.2.4`](./examples/viewer-polls) - Stream Polls\
[@truffle/mutation-observer@`0.4.2`](./examples/mutation-observer) - Mutation
Observer example\
[@truffle/spotify-integration@`3.0.1`](./examples/spotify-integration) - Spotify
Now Playing widget\
[@dev/chessmaster@`0.6.3`](./examples/chessmaster) - Lichess integration\
[@truffle/demo-discord-bot@`0.0.1`](./examples/discord-bot-demo) - Discord bot
using Truffle API\
[@truffle/mashing-minigame@`0.2.12`](./examples/mashing-minigame) - Round-based
minigame example

**Stream Projects**\
[@truffle/raid@`0.0.4`](./stream-projects/raid) - Stream Raids

<!-- END PACKAGES -->

# Contributing

**Do not** import between packages with relative paths. Use
`https://tfl.dev/@truffle/...`

## Prevent committing secrets

Use [git-secrets](https://github.com/awslabs/git-secrets#installing-git-secrets)

- `git secrets --install`
- `git secrets --add 'sk_([a-zA-Z0-9]+)'`
