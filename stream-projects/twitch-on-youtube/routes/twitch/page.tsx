import React from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.3/jumper/jumper.ts";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

jumper.call('twitch.onSubscribeRequest', () => {
  console.log('subscribe button pressed');
})

function TwitchPage() {
  return "twitch embed";
}

export default toDist(TwitchPage, import.meta.url);
