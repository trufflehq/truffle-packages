# truffle-packages

## Repository Map

> More information available in package README

<!-- START PACKAGES -->

**Packages**  
[@truffle/router@`1.0.0`](./router) - Framework-agnostic fs router  
[@truffle/events@`0.0.1`](./events) - Utilities for handling webhooks from Truffle  
[@truffle/distribute@`2.0.20`](./distribute) - Wrappers to create web components from various frameworks  
[@truffle/global-context@`1.0.0`](./global-context) - Truffle Global Context to share info between packages  
[@truffle/config@`1.0.0`](./config) - Env/API config  
[@truffle/third-party-oauth@`2.0.22`](./third-party-oauth) - Login and other auth utilities  
[@truffle/api@`0.2.27`](./api) - Hooks and functions for interacting with Truffle's backend  
[@truffle/utils@`0.0.35`](./utils) - Browser & Node utilities  
[@truffle/ui@`0.1.12`](./ui) - Unified UI library (WIP)  
[@truffle/context@`1.0.0`](./context) - Framework-agnostic context  
[@truffle/state@`0.0.12`](./state) - Signals coupled with Legend state for React  
[@truffle/youtube-js@`0.5.9`](./youtube-js) - Truffle fork of [Youtube.js](https://github.com/LuanRT/YouTube.js)  
[@truffle/route-installer@`0.5.7`](./route-installer) - Provides an action that allows packages to add their routes into other packages.  
[@truffle/functions@`0.0.4`](./functions) - Utilities for creating Truffle Edge Functions

**Examples**  
[@truffle/mutation-observer@`0.4.2`](./examples/mutation-observer) - Mutation Observer example  
[@truffle/mashing-minigame@`0.2.12`](./examples/mashing-minigame) - Round-based minigame example  
[@truffle/spotify-integration@`3.0.1`](./examples/spotify-integration) - Spotify Now Playing widget  
[@truffle/events-demo-backend@`0.0.12`](./examples/events-demo-backend) - [Events](../../events) demo  
[@truffle/create-react-project@`0.5.8`](./examples/create-react-project) - Truffle project React template  
[@dev/chessmaster@`0.6.3`](./examples/chessmaster) - A package to facilitate a streamer vs chat chess game using https://lichess.org.  
[@truffle/viewer-polls@`0.2.4`](./examples/viewer-polls) - Stream Polls  
[@truffle/demo-discord-bot@`0.0.1`](./examples/discord-bot-demo) - Discord bot using Truffle API  
[@truffle/song-suggestions@`0.0.24`](./examples/song-suggestions) - Song Suggestions Suite  
[@truffle/chants@`0.0.5`](./examples/chants) - Chants

**Stream Projects**  
[@truffle/notifications@`0.1.4`](./stream-projects/notifications) - Send notifications to your users when you go live.  
[@truffle/do-something@`0.1.4`](./stream-projects/do-something) - Let your audience control you through collectibles!  
[@truffle/raid@`1.0.4`](./stream-projects/raid) - Stream Raids  
[@truffle/better-chat@`0.0.13`](./stream-projects/better-chat) - Youtube chat mutation observer  
[@truffle/chat@`0.0.16`](./stream-projects/chat) - Chat client for 3rd party chats  
[@truffle/chat-theme@`0.0.3`](./stream-projects/chat-theme) - Theme for chat

<!-- END PACKAGES -->

# Contributing

- **Do not** import between packages with relative paths. Use
  `https://tfl.dev/@truffle/...`
- run `npm ci` in the root to install Husky

## Prevent committing secrets

Use [git-secrets](https://github.com/awslabs/git-secrets#installing-git-secrets)

- `git secrets --install`
- `git secrets --add 'sk_([a-zA-Z0-9]+)'`
