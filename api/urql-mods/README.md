https://github.com/FormidableLabs/urql/tree/main/packages/react-urql/src/hooks

only changes are:

- npm.tfl.dev imports
- useClient -> getClient that just pulls from truffle global context instead of
  react (no provider req)
