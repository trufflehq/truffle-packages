# Load Balanacer Backend

This directory holds the code to load balance submissions across multiple deployments of the `backend/` folder. During load testing we discovered that Deno Deploy has a 512MB cap/worker and got bogged down when simulating a high number of submissions. This isolate will distribute the submission request across a number of replica deployments

## Deploy
```
deployctl deploy --token <token> --project=song-suggestion --import-map=import_map.json  index.ts
```