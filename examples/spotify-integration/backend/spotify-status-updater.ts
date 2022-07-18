const TOKEN = "https://accounts.spotify.com/api/token/";
const clientID = "6e3fb4038a394b088650cee5244c31c6";
const clientSecret = "REPLACE ME";
addEventListener("fetch", (event) => {
  return event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
  const request = event.request;
  // the client should request spotify data by orgID and set in the URL search parameters
  const params = (new URL(request.url)).searchParams;
  const org = params.get("orgID");
  if (!org) return new Response("specify orgID");
  //store spotify data by request.url and store auth tokens with the added TOKEN url parameter
  const cacheKeys = {
    spotifyData: new Request(request.url),
    authToken: new Request(`${request.url}&TOKEN=true`),
  };
  //load default cloudflare cache
  const cache = caches.default;
  //check cache for spotify data
  let response = await cache.match(cacheKeys.spotifyData);
  if (!response) {
    console.log(
      `Spotify data for ${org} is not present in cache. Fetching and caching request.`,
    );
    response = await fetchAndUpdateCache(event, cache, cacheKeys, org, 10);
  } else {
    console.log("cache hit");
  }
  return response;
}

async function fetchAndUpdateCache(
  event,
  cache,
  cacheKeys,
  org: string,
  maxAge: number,
) {
  //get an access token from cache or fetch a new one from spotify to perform Spotify data API call
  const accessToken = await getAccessToken(event, cache, cacheKeys, org);
  //get Spotify data from Spotify API
  const songResponse = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  if (songResponse.status !== 200) {
    return new Response(
      `error ${songResponse.status} getting spotify cache ${org}`,
    );
  }
  const song = await songResponse.json();
  const out = parseSpotifyData(song);
  const response = new Response(out, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "content-type": "application/json;charset=UTF-8",
      "Cache-Control": `s-maxage-${maxAge}`,
    },
  });
  event.waitUntil(cache.put(cacheKeys.spotifyData, response.clone()));
  return response;
}

function parseSpotifyData(song) {
  return JSON.stringify({
    title: song.item.name,
    artists: song.item.artists,
    album: song.item.album.name,
    link: song.item.external_urls.spotify,
    position: song.progress_ms,
    length: song.item.duration_ms,
    images: song.item.album.images,
    is_playing: song.is_playing,
  });
}

async function getAccessToken(event, cache, cacheKeys, org) {
  let response = await cache.match(cacheKeys.authToken);
  if (!response) {
    console.log(`Token for ${org} expired, refreshing`);
    response = await refreshAndCacheAccessToken(event, cache, cacheKeys, org);
  } else {
    console.log("cache hit");
  }
  return (await response.json()).access_token;
}

async function refreshAndCacheAccessToken(
  event,
  cache,
  cacheKeys,
  org: string,
) {
  //pull refresh token from cloudflare KV
  const refreshToken = await REFRESH_TOKENS.get(org);
  if (!refreshToken) console.error(`refresh token not found for ${org}`);
  const tokenResponse = await fetch(TOKEN, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + btoa(`${clientID}:${clientSecret}`),
    },
    body: new URLSearchParams({
      "grant_type": "refresh_token",
      "refresh_token": refreshToken,
    }),
  });
  if (tokenResponse.status !== 200) {
    console.log("shit failed " + tokenResponse.status + " " + refreshToken);
    return new Response(tokenResponse.status);
  }
  //get access token from response
  const responseJSON = await tokenResponse.json();
  const token = responseJSON.access_token;
  const expiration = responseJSON.expires_in;
  //cache access token and set to expire as specified in the response
  const response = new Response(JSON.stringify({ access_token: token }), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "Cache-Control": `s-maxage-${expiration}`,
    },
  });
  event.waitUntil(cache.put(cacheKeys.authToken, response.clone()));
  return response;
}
