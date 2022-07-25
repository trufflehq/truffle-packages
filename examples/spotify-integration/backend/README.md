# Spotify Backend

The backend handle OAuth with Spotify as well as fetching the currently playing song. Hosted on Deno Deploy.

### Endpoints
`/spotify/auth/login?orgId=<orgId>`: The endpoint for connecting OAuth with an org.
`spotify/song/info?orgId=<orgId>`: The endpoint for fetching the song info for an org.

### Deploy
```
deployctl deploy --token <token> --project=spotify-song-info --import-map=import_map.json  index.ts
```