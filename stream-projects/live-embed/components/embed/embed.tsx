import React, { useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import { previewSrc } from "https://tfl.dev/@truffle/raid@1.0.6/shared/util/stream-plat.ts";
import { useGoogleFontLoader } from "https://tfl.dev/@truffle/utils@~0.0.3/google-font-loader/mod.ts";
import {
  gql,
  useMutation,
} from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";
import { useSignal } from "https://tfl.dev/@truffle/state@~0.0.8/mod.ts";
import { useSelector } from "https://npm.tfl.dev/@legendapp/state@~0.19.0/react";
import Icon from "https://tfl.dev/@truffle/ui@~0.2.0/components/legacy/icon/icon.tsx";

import useChannel from "../../utils/use-channel.ts";
import styleSheet from "./embed.scss.js";

const CLOSE_ICON_PATH =
  "M19,6.41 L17.59,5 L12,10.59 L6.41,5 L5,6.41 L10.59,12 L5,17.59 L6.41,19 L12,13.41 L17.59,19 L19,17.59 L13.41,12 L19,6.41 Z";
const EXPAND_ICON_PATH =
  "M14 21v-2h3.59l-4.5-4.5 1.41-1.41 4.5 4.5V14h2v7h-7M9.5 10.91L5 6.41V10H3V3h7v2H6.41l4.5 4.5-1.41 1.41z";
const OPEN_IN_NEW_ICON_PATH =
  "M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z";

const VISIBLE_STYLE = {
  width: "100%",
  height: "auto",
  display: "block", // need to replace hidden style
  "aspect-ratio": "16 / 9",
  "min-height": "200px", // in case aspect-ratio isn't supported
  "margin-bottom": "12px",
  background: "transparent",
};

const COLLAPSED_STYLE = {
  ...VISIBLE_STYLE,
  "aspect-ratio": "unset",
  "min-height": "32px",
  height: "32px",
};

const HIDDEN_STYLE = {
  display: "none",
};

const DATAPOINT_INCREMENT_METRIC_MUTATION = gql`
mutation DatapointIncrementMetric ($input: DatapointIncrementMetricInput!) {
  datapointIncrementMetric(input: $input) { isUpdated }
}`;

const DATAPOINT_INCREMENT_UNIQUE_MUTATION = gql`
mutation DatapointIncrementUnique ($input: DatapointIncrementUniqueInput!) {
  datapointIncrementUnique(input: $input) { isUpdated }
}`;

const ONE_MINUTE_MS = 60 * 1000;
const ONE_MONTH_SECONDS = 3600 * 24 * 30;

function Embed({ sourceType, sourceId, sourceName, forceIsLive }) {
  useStyleSheet(styleSheet);
  useGoogleFontLoader(() => ["Roboto"]);

  const [_incrementMetricPayload, executeDatapointIncrementMetricMutation] =
    useMutation(
      DATAPOINT_INCREMENT_METRIC_MUTATION,
    );

  const [_incrementUniquePayload, executeDatapointIncrementUniqueMutation] =
    useMutation(
      DATAPOINT_INCREMENT_UNIQUE_MUTATION,
    );

  // const isLive = useIsLive({ sourceType: "youtubeLive" });
  const channel = useChannel({ sourceType, sourceId, sourceName });
  let { isLive, channelName } = channel || {};

  isLive = isLive || forceIsLive;

  const isCollapsed$ = useSignal(false);
  const isCollapsed = useSelector(() => isCollapsed$.get());

  const recordCcv = () => {
    executeDatapointIncrementUniqueMutation({
      input: {
        metricSlug: "live-embed-ccvs",
        timeScale: "minute",
        ttlSeconds: ONE_MONTH_SECONDS,
        // TODO: need to grab currently live videoId somehow
        // filterValues: {
        //   video: videoId,
        // },
      },
    });
  };

  useEffect(() => {
    // set styles for this iframe within YouTube's site
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        { action: "useSubject" }, // start with our iframe
        {
          action: "setStyle",
          value: isLive
            ? isCollapsed ? COLLAPSED_STYLE : VISIBLE_STYLE
            : HIDDEN_STYLE,
        },
      ],
    });
  }, [isLive, isCollapsed]);

  useEffect(() => {
    if (isLive) {
      executeDatapointIncrementMetricMutation({
        input: {
          metricSlug: "live-embed-views",
          count: 1,
        },
      });
      // TODO: stop when no longer live
      recordCcv();
      setInterval(recordCcv, ONE_MINUTE_MS);
    }
  }, [isLive]);

  const recordClick = () => {
    executeDatapointIncrementMetricMutation({
      input: {
        metricSlug: "live-embed-clicks",
        count: 1,
      },
    });
  };

  const toggle = (e) => {
    e?.stopPropagation();
    e?.preventDefault();
    isCollapsed$.set(!isCollapsed$.get());
  };

  const url = sourceType === "twitch"
    ? `https://twitch.tv/${sourceName}`
    : `https://youtube.com/channel/${sourceId}/live`;

  const previewUrl = sourceType === "twitch"
    ? `${previewSrc(url)}&muted=true&quality=360p30`
    : `${
      previewSrc(`https://youtube.com/channel/${sourceId}`)
    }&autoplay=1&mute=1`;

  return (
    <div className={`c-embed ${isCollapsed ? "is-collapsed" : ""}`}>
      <a className="title" href={url} target="_blank" onClick={recordClick}>
        <span className="live" />
        {channelName} is live
        <div className="close">
          <Icon
            icon={isCollapsed ? EXPAND_ICON_PATH : CLOSE_ICON_PATH}
            onclick={toggle}
            size="18px"
            color={"#FFFFFF"}
          />
        </div>
      </a>
      <a className="button" href={url} target="_blank" onClick={recordClick}>
        <Icon
          icon={OPEN_IN_NEW_ICON_PATH}
          size="24px"
          color="#fff"
        />
        Watch now
      </a>
      {isLive && !isCollapsed && (
        <iframe
          className="iframe"
          frameBorder="0"
          src={previewUrl}
        />
      )}
    </div>
  );
}

export default Embed;
