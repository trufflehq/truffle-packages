import React, { useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.3/jumper/jumper.ts";

// request needs to come from twitch frame, which is why this route exists
// (this route is embedded in twitch embed)
// only reason react is necessary here is so we can pass the sourceName
export default function TwitchPage({ channelName }) {
  useEffect(() => {
    jumper.call('twitch.getSubscribeButtonUser', { channelName })
    .then((res) => {
      // send for our /youtube iframe to use the result
      jumper.call('comms.postMessage', { type: 'twitch.subscribeButtonUser', body: res })
    })
  }, []);

  return <></>;
}
