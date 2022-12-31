import React from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.3/jumper/jumper.ts";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

const callbacks = [];
// FIXME: allow setting new jumper methods after the fact? would need to inform children of new methods
// jumper.on('twitch.onSubscribeRequest', (callback) => {
//   callbacks.push(callback);
// })

function subscribe() {
  console.log('subscribe clicked');
  callbacks.forEach((callback) => callback());  
}

// TODO: check for prime subs
// TODO: embed stream

function YouTubePage() {
  return <>
    <iframe src="https://player.twitch.tv/?channel=stanz&parent=localhost" width="600" height="600" />
    <button onClick={subscribe}>click</button>
  </>;
}

export default toDist(YouTubePage, import.meta.url);
