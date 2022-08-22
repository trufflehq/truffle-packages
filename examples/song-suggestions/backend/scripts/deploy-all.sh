#!/usr/bin/env bash

cd $(dirname "${BASH_SOURCE[0]}")/..

if [[ -z $DENO_DEPLOY_KEY ]] ; then
    echo "Missing DENO_DEPLOY_KEY var"
    echo "export DENO_DEPLOY_KEY=<key>"
    exit 1
fi


# song-suggestion
/Users/rileymiller/.deno/bin/deployctl deploy --token "$DENO_DEPLOY_KEY" --project=song-suggestion --import-map=import_map.json  index.ts


# song-suggestion-1
/Users/rileymiller/.deno/bin/deployctl deploy --token "$DENO_DEPLOY_KEY" --project=song-suggestion-1 --import-map=import_map.json  index.ts

# song-suggestion-2
/Users/rileymiller/.deno/bin/deployctl deploy --token "$DENO_DEPLOY_KEY" --project=song-suggestion-2 --import-map=import_map.json  index.ts

# Song-suggestion-3
/Users/rileymiller/.deno/bin/deployctl deploy --token "$DENO_DEPLOY_KEY" --project=song-suggestion-3 --import-map=import_map.json  index.ts

# Song-suggestion-4
/Users/rileymiller/.deno/bin/deployctl deploy --token "$DENO_DEPLOY_KEY" --project=song-suggestion-4 --import-map=import_map.json  index.ts


