# Spotify Backend

The backend handle OAuth with Spotify as well as fetching the currently playing song. Hosted on Deno Deploy.

### Deploy
```
deployctl deploy --token <token> --project=spotify-song-info --import-map=import_map.json  index.ts
```