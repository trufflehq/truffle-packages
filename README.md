# truffle-packages

## Packages:

### @truffle/api

For API requests. `useMutation` and `useQuery`
[from urql](https://formidable.com/open-source/urql/docs/api/urql/)

We'll automatically pass the user's accessToken and orgId to the server for the
request to work properly.

### @truffle/ui

Core UI components that anyone can use. These implement our
[Truffle Design System](https://github.com/trufflehq/design-system) so theme
developers can customize the entire look of a page, including for packages
created by 3rd-parties.

### @truffle/context

Similar to React context. Lets us store state without having to create a new
class and pass down the instance between all components (passing down is
unrealistic since 3rd party devs will be building components)

### @truffle/global-context

The context we store global state on (including the unique context for each SSR
run).

You shouldn't use index.ts direct, use `getPackageContext` and
`setPackageContext` from
`https://tfl.dev/@truffle/global-context@%5E1.0.0/package-context.js`

eg `setPackageContext("@my-org/my-package@1", { ... })` and
`getPackageContext("@my-org/my-package@1")`

### @truffle/utils

For misc stuff like streams, formatting, cookies, etc... You likely won't need
to use this package

# Contributing

**Do not** import between packages with relative paths. Use
`https://tfl.dev/@truffle/...`

## Prevent committing secrets

Use [git-secrets](https://github.com/awslabs/git-secrets#installing-git-secrets)

- `git secrets --install`
- `git secrets --add 'sk_([a-zA-Z0-9]+)'`
