# Truffle Discord Bot Example

`backend/supabase/functions/truffle-discord-bot-demo` is an example of a Supabase Edge Function written in Deno that will:

- Use Discord [slash commands](https://discord.com/developers/docs/interactions/application-commands#application-commands) and the Truffle
  API to display user data

### Getting Started

To get setup on the Supabase side of things you can follow the guide from the Supabase official
[docs](https://supabase.com/docs/guides/functions#creating-a-function).

- Install the `supabase` CLI. [Docs](https://supabase.com/docs/reference/cli/installing-and-updating)
- Login to the CLI `supabase login`. [Docs](https://supabase.com/docs/reference/cli/supabase-login)
- You can skip the `supabase init` step and repurpose the `supabase/` folder and `config.toml` file from the forked
  `@truffle/discord-bot-demo` package. If you skip `supabase init` you will need to create a project through the
  [Supabase Admin Dashboard](https://app.supabase.com/) and update the `project_id` field inside of the `config.toml`.
- Link to your remote Supabase project with `supabase link --project-ref <ref>`. You can find your project ref if you click on the project
  in the Supabase Admin and grab the ref from the url e.g `https://app.supabase.com/project/<ref>`
  [Docs](https://supabase.com/docs/reference/cli/supabase-link)
- Deploy the Supabase Edge Function `supabase functions deploy truffle-discord-bot-demo --no-verify-jwt`
  - **Note: Make sure you deploy the function with the `--no-verify-jwt` flag so the function can receive requests from Discord API
    webhooks** (we perform our own [validation](./supabase/functions/truffle-discord-bot-demo/index.ts#L24))
- Create a [new Discord application](https://discord.com/developers/applications). Use the name and avatar of your choice.
- If you're using the Supabase Edge Function template, you will need to setup a couple of environment variables for your function. To setup
  the environment variables you can add them to `backend/supabase/.env` and sync them with your remote Supabase project w/
  `supabase secrets set --env-file ./supabase/.env` **after you've deployed the function, otherwise they'll be overwritten.**
  - `TRUFFLE_API_KEY` is used to sign requests the function makes to the Truffle Graphql API. You can copy the generated Truffle Package API
    key from `truffle.secret.mjs`.
  - `DISCORD_PUBLIC_KEY` is used to verifiy requests coming from the Discord API. You can find this key on the `Public Key` section of your
    Discord application page, `discord.com/developers/applications/:id/information`.
  - `DISCORD_TOKEN` is used to authorize requests to the Discord API, such as when deploying your commands in the following steps. On the
    same page from above, click the `Bot` tab. You may need to click `Create Bot`. Make sure you copy and store the token, because it will
    not be shown again.

- Add the bot to your testing Discord server by visiting the link:
  `https://discord.com/api/oauth2/authorize?client_id={CLIENT_ID}&scope=applications.commands%20bot`, replacing `{CLIENT_ID}` with the
  `Application ID` from the `discord.com/.../information` page above.

- Load your env, and run the [Deploy Commands script](../backend/supabase/scripts/deployCommands.ts) to register the `user` slash command
  with the Discord API. It may take a moment for the commands to reflect on the desktop UI.

- Test out executing the remote function by running `/ping` in and channel where the bot was added.
