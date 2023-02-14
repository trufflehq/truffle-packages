# Auth request

```
POST https://www.youtube.com/youtubei/v1/account/account_menu?key=???

x-origin: https://www.youtube.com
authorization: SAPISIDHASH ???
x-goog-authuser: ???
x-goog-pageid: ???
cookie: ???

{
	"context": {
		"client": {
			"clientName": "WEB",
			"clientVersion": ???
		}
	}
}
```

body.context: `window.yt.config_["INNERTUBE_CONTEXT"]`

?key= `window.yt.config_["INNERTUBE_API_KEY"]`
x-goog-authuser: `window.yt.config_["SESSION_INDEX"]`
x-goog-pageid: `window.yt.config_["DELEGATED_SESSION_ID"]`
cookie: `Browser.cookies.get`


authorization:
1. Grab cookie `SAPISID`, or `__Secure-3PAPISID` if undefined
2. Grab window hostname (https://www.youtube.com)

3. Generate hash:
args: (hostname, cookie)

let date = Math.floor(new Date().getTime() / 1E3)

return date + "_" + sha1(date + " " + cookie + " " + hostname)