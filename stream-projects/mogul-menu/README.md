# `@truffle/mogul-menu` 🍄

The main menu used in the Truffle.TV browser extension.

### Installation

To get started you will need a Truffle Development org and API key. If you don't
have one, reach out in the
[Truffle Dev Platform Discord](https://discord.gg/SkA6QXBQ) and we'll get you
setup if you're interested in contributing.

- Run through the first step in the
  [Get Started guide](https://docs.truffle.vip/the-basics/get-started) to get
  setup with `truffle-cli`.

- Fork this package to your development org:

```shell
truffle-cli fork @truffle/mogul-menu mogul-menu
```

- Update `truffle.config.mjs` to:

```js
export default {
  name: "@<dev-org>/mogul-menu",
  version: "<mogul-menu version>",
  apiUrl: "https://mycelium.staging.bio/graphql",
};
```

- Run `truffle-cli deploy`

### Development

- Start the local dev server with `truffle-cli dev`.
- Event though `truffle-dev-server` technically runs on Node 18, we still
  recommend using the
  [Deno VSCode Extension](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
  during development to help with url imports, intellisense, and formatting.

### Project Structure

- `routes/` there are two routes you can use for local development:
  - `home/` loads in the menu.
  - `claim/` loads in the channel points widget that appears under chat.
- `components/` all of the project React components
- `shared/`
  - `shared/gql/` shared GraphQL fragments
  - `shared/util/` shared hooks, functions, and other utilities
- `types/`
  - Shared types for components and the Truffle API. Plan on bringing this over
    to the `shared/` folder.
- `truffle.config.mjs` the Truffle package config.
- `truffle.secret.mjs` package API key.

### Usage

To import `mogul-menu`into another Truffle project, you can import via url with:

```tsx
import MogulMenu from "https://tfl.dev/@truffle/mogul-menu@^0.1.84/components/menu/menu.tsx";

...

return (
       <MogulMenu
        iconImageObj={...}
        tabs={...}
      />
)
```
