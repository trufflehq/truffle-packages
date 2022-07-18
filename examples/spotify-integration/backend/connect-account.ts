const AUTHORIZE = "https://accounts.spotify.com/authorize";
const REDIRECT_URI =
  "https://connect-account.shanecranor.workers.dev/callback/";
const TOKEN = "https://accounts.spotify.com/api/token/";
const clientID = "6e3fb4038a394b088650cee5244c31c6";
const clientSecret = "replace me";
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
  const request = event.request;
  const params = (new URL(request.url)).searchParams;
  const code = params.get("code");
  const org = params.get("org");
  //require code before we can put into KV
  if (!code) return requestAuthorization();
  if (org) {
    const tokenResponse = await fetch(TOKEN, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + btoa(`${clientID}:${clientSecret}`),
      },
      body: new URLSearchParams({
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
      }),
    });
    if (tokenResponse.status !== 200) {
      return new Response(tokenResponse.status);
    }
    const tokenJSON = await tokenResponse.json();
    const token = tokenJSON.refresh_token;
    //put the refresh token in the Cloudflare KV
    await TOKENS.put(org, token);
    return new Response("Success!" + org + "TOKEN: " + token);
  } else {
    //show a temporary html form to ask the user what their orgID is
    const html = `<form onSubmit='
	event.preventDefault();
	const params = new URLSearchParams(window.location.search);
	params.append("org", (new FormData(this)).get("org"));
	window.location.href = "${REDIRECT_URI}?"+params'>
  <label>org id</label>
	<br>
  <input type="text" name='org'>
	<br> 
	<input type="submit" value="set code">
	<p onclick="this.innerText+=window.location.search">Code: </p>
</form> `;
    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  }
  return new Response(code);
}

function requestAuthorization() {
  const params = new URLSearchParams({
    client_id: clientID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    show_dialog: "true",
    scope: "user-read-currently-playing user-read-playback-position",
  });
  let response = Response.redirect(`${AUTHORIZE}?${params}`, 302);
  return response;
}
