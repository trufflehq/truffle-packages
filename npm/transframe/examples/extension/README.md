# Truffle.TV

## Release
- `yarn release`
- Chrome: Upload releases/chrome zip to CWS dash
- Firefox: https://www.notion.so/truffle-labs/Deploying-to-Firefox-2f3d535183c947a6b65bfb6bd39976c8

## Technology Stack:
- React
- Preact
- Emotion
- Typescript
- Rollup
- Browser extensions
- Polymer
- Cloudflare workers
- Reverse engineering
- Flutter

## Functionality

### Youtube Injected
- Detect if the live chat frame is ludwig's
- Re-style live chat
- Style each author's username color
- Add `type` property to badges, to allow moderator badge to be a custom image
- Add emotes, aliases, and badges on `yt-live-chat-item-list-renderer` > `handleAddChatItemAction_`
- Authenticate with the backend when the page loads

### Youtube Content
- Inject settings box into page

### Twitch Injected
- Overwrite fetch

### Twitch Content
- Inject embed

## Settings

### Account

- Choose between aliases (disconnect option)
- Connect new aliases
- Choose color
- Enter subbed months
- Save changes
- Log out

### Player

- Custom theater mode

### Chat

- disable batching

# TODO

- name colors
- caching
- storage buckets
- safari
- popup from page
- onscreen chat
- inject message css
- 