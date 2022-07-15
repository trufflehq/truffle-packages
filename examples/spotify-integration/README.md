# Truffle Spotify App

The idea behind this project was to create an interface for viewers using the
truffle.tv browser extension to quickly and easily view information about the
song that a streamer is listening to on stream. To acomplish this, I built a
widget in React which pulls data from a Cloudflare worker. The worker caches
Spotify API requests and deals with OAuth tokens.

To try it out, feel free to git clone this project and (after creating the
truffle.secret.mjs) run truffle-cli dev to launch the dev server and open
Firefox or Chrome to go to localhost:8000/extension-mapping

To deploy on sporocarp, run truffle-cli deploy and go to the url spit out in the
cli with /extension-mapping appended to the end You can also test this inside
the truffle.tv browser extension by clicking settings and then clicking the
bottom right corner of the window, and then adding the url with
/extension-mapping as an extension mapping and refreshing the page!

Here is what the Spotify app should look like. It should be draggable in both
localhost and when deployed and loaded into the truffle.tv extension

![image](https://user-images.githubusercontent.com/70922464/178805666-c9fa7344-1f6b-443d-a1e7-7b7165052d22.png)

To modify the SCSS, you need to have a CSS compiler because truffle-cli
currently doesn't support SCSS natively. Live Sass Compiler by Ritwick Dey is a
Visual Studio Code extension that will automatically compile to CSS if you use
that as your IDE.

You should be able to reuse the draggable component in any project that you want
users to be able to move around if imported as an extension mapping through the
truffle.tv extension.
