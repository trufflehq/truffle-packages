# truffle-packages

## Repository Map

> More information available in package README

<!-- START PACKAGES -->
<!-- END PACKAGES -->

# Contributing

- **Do not** import between packages with relative paths. Use
  `https://tfl.dev/@truffle/...`
- run `npm ci` in the root to install Husky

## Prevent committing secrets

Use [git-secrets](https://github.com/awslabs/git-secrets#installing-git-secrets)

- `git secrets --install`
- `git secrets --add 'sk_([a-zA-Z0-9]+)'`
