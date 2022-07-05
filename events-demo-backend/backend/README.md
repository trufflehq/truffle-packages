# Truffle Webhook Supabase Edge Function Example

`backend/supabase/functions/viewer-polls-example-handler` is an example of a Supabase Edge Function written in Deno that will:
* Receive webhooks when the Viewer Poll collectible is redeemed
* Lookup the user who redeemed the collectible
* Create a poll in Truffle

### Getting Started
To get setup on the Supabase side of things you can follow the guide from the Supabase official [docs](https://supabase.com/docs/guides/functions#creating-a-function).

* Install the `supabase` CLI. [Docs](https://supabase.com/docs/reference/cli/installing-and-updating)
* Login to the CLI `supabase login`. [Docs](https://supabase.com/docs/reference/cli/supabase-login)
* You can skip the `supabase init` step and repurpose the `supabase/` folder and `config.toml` file from the forked `@truffle/events-demo-backend` package. If you skip `supabase init` you will need to create a project through the [Supabase Admin Dashboard](https://app.supabase.com/) and update the `project_id` field inside of the `config.toml`.
* Link to your remote Supabase project with `supabase link --project-ref <ref>`. You can find your project ref if you click on the project in the Supabase Admin and grab the ref from the url e.g `https://app.supabase.com/project/<ref>` [Docs](https://supabase.com/docs/reference/cli/supabase-link) 
* If you're using the Supabase Edge Function template, you will need to setup a couple of environment variables for your function. To setup the environment variables you can add them to `backend/supabase/.env` and sync them with your remote Supabase project w/ `supabase secrets set --env-file ./supabase/.env`.
  * `TRUFFLE_API_KEY` is used to sign requests the function makes to the Truffle Graphql API. You can copy the generated Truffle Package API key from `truffle.secret.mjs`.
  * `VIEWER_CREATED_POLL_EVENT_TOPIC_SLUG` is used to specify the custom event topic defined in the collectible,  grab the slug from the EventTopicUpsert installation step.
* Deploy the Supabase Edge Function `supabase functions deploy viewer-polls-example-handler --no-verify-jwt`
  * **Note: Make sure you deploy the function with the `--no-verify-jwt` flag so the function can receive requests from Truffle API webhooks**
* Test out executing the remote function with:
```shell
curl -L -X POST '<supabase function url>' --data '{"name":"Functions"}'
```
* Update the EventSubscription webhook action endpoint attribute with the public url of the Supabase Edge Function inside of the `truffle.config.mjs` `installActionRel` field. This is required to create the webhook for the edge function during package installation