# pages
> easily deploy sites (with build-scripts) (in a yarn3 monorepo) to Cloudflare Pages

## Usage
```yaml
steps:
  - name: Checkout repository
    uses: actions/checkout@v3

  - name: Deploy
    uses: trufflehq/truffle-packages/actions/pages@main
    with:
      # The script to build your site (default: `build`) (joins with `yarn workspace $workspace_name`)
      # build_script: build
      # Cloudflare Account ID
      cloudflare_account_id: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
      # Cloudflare API Token
      cloudflare_api_token: ${{ secrets.CLOUDFLARE_PAGES_API_KEY }}
      # The directory of static assets to upload (default: `dist`)
      # directory: dist
      # GitHub Token
      github_token: ${{ secrets.GITHUB_TOKEN }}
      # Optional: The script to run before building your site
      # prebuild_script: yarn build
      # Optional: The branch to deploy to production
      # production_branch: main
      # The name of the Cloudflare Pages project
      project_name: app-truffle-vip
      # The name of the yarn workspace being deployed
      workspace_name: app.truffle.vip
```
