Until we get better dev platform support on Deno...

TODOs before we can use
- Implement routing: https://github.com/kriasoft/universal-router
- Would need to use https://vitejs.dev/guide/ssr.html#setting-up-the-dev-server for fs routing to work (ssr passes routes to client, since client can't get the files)
  - Not sure we could use npx anymore. Would prob need a package.json :/