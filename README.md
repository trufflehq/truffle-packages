# truffle-packages

**Do not** import between packages with relative paths. Use `https://tfl.dev/@truffle/...`

## Packages:

### @truffle/api
For WebSockets / API requests (need to clean this up a lot)

### @truffle/utils
For misc stuff like streams, formatting, cookies, etc... (need to clean this up a lot)

### @truffle/ui
UI components that anyone can use

### @truffle/context
Similar to React context. Lets us store state without having to create a new class and pass down the instance between all components (passing down is unrealistic since 3rd party devs will be building components)

### @truffle/global-context
The context we store global state on. If you import `https://tfl.dev/@truffle/global-context@1.0.0/index.js`, you can use `getStore()` which will return the global context (including the unique context for each SSR run)

# Contributing
## Prevent committing secrets
Use [git-secrets](https://github.com/awslabs/git-secrets#installing-git-secrets)
- `git secrets --install`
- `git secrets --add 'sk_([a-zA-Z0-9]+)'`