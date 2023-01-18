import React, { useState, useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.3/jumper/jumper.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import { useGoogleFontLoader } from "https://tfl.dev/@truffle/utils@~0.0.3/google-font-loader/mod.ts";
import { gql, useMutation } from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";
import { previewSrc } from "https://tfl.dev/@truffle/raid@1.0.6/shared/util/stream-plat.ts";

import styleSheet from "./prime-button-youtube.scss.js";

// TODO: this package/route could probably be consolidated with twitch live embed route

const VISIBLE_STYLE = {
  width: "100%",
  height: "104px",
  display: "block", // need to replace hidden style
  "margin-bottom": "12px",
  background: "transparent",
};

const HIDDEN_STYLE = {
  display: "none",
};

const DATAPOINT_INCREMENT_METRIC_MUTATION = gql `
mutation DatapointIncrementMetric ($input: DatapointIncrementMetricInput!) {
  datapointIncrementMetric(input: $input) { isUpdated }
}`

export default function YouTubePage({ channelName = 'stanz' }) {
  useStyleSheet(styleSheet);
  useGoogleFontLoader(() => ["Roboto"]);

  const [_, executeDatapointIncrementMetricMutation] = useMutation(
    DATAPOINT_INCREMENT_METRIC_MUTATION,
  );
  
  const [canPrimeSubscribe, setCanPrimeSubscribe] = useState(false);

  useEffect(() => {
    // this will come from the /twitch route
    jumper.call('comms.onMessage', (message) => {
      if (message?.type === 'twitch.subscribeButtonUser') {
        console.log('res', message.body);
        
        if (message.body?.[0]?.data?.user?.self?.canPrimeSubscribe) {
          setCanPrimeSubscribe(true)
        }
      }
    })
  }, [])

  useEffect(() => {
    if (canPrimeSubscribe) {
      executeDatapointIncrementMetricMutation({
        input: {
          metricSlug: 'prime-button-views',
          count: 1
        }
      })
    }
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        { action: "useSubject" }, // start with our iframe
        {
          action: "setStyle",
          value: canPrimeSubscribe
            ? VISIBLE_STYLE
            : HIDDEN_STYLE
        },
      ],
    });
  }, [canPrimeSubscribe])

  // purposefully "undefined" so we don't double-load anyone's embedded stream when they're live
  // don't want to inflate views / increase bandwidth.
  // undefined account should always be a non-live stream
  // NOTE: we only have 1 embed for this. sourceType: "twitchEmbed", sourceId "undefined"
  const embedUrl = `${previewSrc(`https://twitch.tv/undefined`)}&muted=true&autoplay=false`
  const subscribeUrl = `https://www.twitch.tv/subs/${channelName}`  

  const recordClick = () => {
    executeDatapointIncrementMetricMutation({
      input: {
        metricSlug: 'prime-button-clicks',
        count: 1
      }
    })
  }
  
  return <>
    {!canPrimeSubscribe ? <iframe src={embedUrl} width="600" height="600" className="iframe" /> : undefined}
    {canPrimeSubscribe ? <div className="c-youtube">
      <div className="title">Your Twitch Prime is available</div>
      <a href={subscribeUrl} target="_blank" className="button" onClick={recordClick}>Use Prime on Stanz</a>
    </div>: undefined}
  </>;
}
