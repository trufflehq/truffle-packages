# Song Suggestion Backend

The folder holds a Deno Deploy Isolate that we use to manage the state of submissions, process
events from Truffle, and start polls for viewers to vote on.

## Structure

### `areas/`
Areas are used to organize different domains of functionality. We really only use two to separate processing events and actions fired from the admin dashboard.

### `controllers/`
Traditional REST controllers that define endpoints and perform validation.

### `models/` 
DTOs that we use to validate requests and serialize data inside the controllers.

### `services/`
Controllers handle processing the requests and services handle the application logic.

### `repositories/`
Repositories are responsible for handling data access from our own database or remote APIs. 

### `utils/`
Helper functions

### `types/`
Types used throughout the backend that aren't tied directly to serialization (models).

## Deploy
```
deployctl deploy --token <token> --project=song-suggestion --import-map=import_map.json  index.ts
```