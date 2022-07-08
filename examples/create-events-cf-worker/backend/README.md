# Truffle Webhook Cloudflare Worker Example

`backend/supabase/functions/viewer-polls-example-handler` is an example of a Supabase Edge Function written in Deno that will:
* Receive webhooks when the Viewer Poll collectible is redeemed
* Lookup the user who redeemed the collectible
* Create a poll in Truffle

### Getting Started
To get setup on the Supabase side of things you can follow the guide from the Cloudflare Worker official [docs](https://developers.cloudflare.com/workers/get-started/guide/).

* Install the `wrangler` CLI. [Docs](https://developers.cloudflare.com/workers/get-started/guide/#1-install-wrangler-workers-cli)
* Login to the CLI `wrangler login`. [Docs](https://developers.cloudflare.com/workers/get-started/guide/#2-authenticate-wrangler)
* You can skip the `wrangler init` step and repurpose the forked `create-events-cf-worker` worker by editing the `wrangler.toml` file. You'll need to update the `name` field if you change the name of the worker and will need to update the `VIEWER_CREATED_POLL_EVENT_TOPIC_SLUG` env variable to the event topic slug you set in `truffle.config.mjs`.
* Deploy the worker with `wrangler publish src/index.ts --name create-events-cf-worker`
* Set the `TRUFFLE_API_KEY` variable with `wrangler secret put TRUFFLE_API_KEY` and paste in your package API key from `truffle.secret.mjs`.
* Test out executing the remote function with:
```shell
curl -L -X POST '<worker dev url>' --data '{"name":"Functions"}'
```
* Update the EventSubscription webhook action endpoint attribute with the public url of the CF Worker inside of the `truffle.config.mjs` `installActionRel` field. This is required to create the webhook for the worker during package installation