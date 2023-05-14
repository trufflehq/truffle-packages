import jumper from "https://tfl.dev/@truffle/utils@~0.0.3/jumper/jumper.ts";
import { gql, mutation } from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";

const DATAPOINT_INCREMENT_METRIC_MUTATION = gql`
mutation DatapointIncrementMetric ($input: DatapointIncrementMetricInput!) {
  datapointIncrementMetric(input: $input) { isUpdated }
}`;

const TEN_SECONDS_MS = 10 * 1000;

type ButtonInfo = {
  metricSlug: string;
  id: string;
};

// this function saves the datapoint "filters" we want to set.
// filters are similar to dimensions.
// the filters are the youtube channel id and video id, so we can get
// graphs for a specific video or channel

// to get the filters, we need to get the extension info from the extension
// and since we don't cleanup and reload this embed if the extension pageIdentifiers
// haven't changed, we need to query for the extension info every 10 seconds
let datapointFilterValuesPromise, previousDatapointFilterValuesStr;
async function setFilterValues() {
  datapointFilterValuesPromise = jumper.call(
    "context.getInfo",
  ).then((extensionInfo) =>
    getDatapointFiltersFromExtensionInfo(extensionInfo)
  );

  const newDatapointFilterValuesStr = JSON.stringify(
    await datapointFilterValuesPromise,
  );
  // true if the video or channel has changed (and embed is still around)
  const hasFiltersChanged =
    previousDatapointFilterValuesStr !== newDatapointFilterValuesStr;

  if (hasFiltersChanged) {
    recordMetric("youtube-from-client-video-views");
  }

  previousDatapointFilterValuesStr = newDatapointFilterValuesStr;
}

async function recordMetric(
  metricSlug: string,
): Promise<void> {
  mutation(DATAPOINT_INCREMENT_METRIC_MUTATION, {
    input: {
      metricSlug,
      count: 1,
      filterValues: await datapointFilterValuesPromise,
    },
  });
}

export function listen() {
  // TODO: may need to change #top-row and #comment-box #submit-button to body
  // if they don't exist when iframe is loaded in.
  // drawback is it's less performant since we run the handleMatches fn any time anything
  // change in any part of dom
  setFilterValues();
  setInterval(setFilterValues, TEN_SECONDS_MS);

  // listen for the like/subscribe/etc dom button elements
  jumper.call("layout.listenForElements", {
    listenElementLayoutConfigSteps: [
      {
        action: "querySelector",
        value: "#top-row",
      },
    ],
    targetQuerySelector: "button",
    observerConfig: { childList: true },
  }, handleMatches);

  // listen for the comment dom button element
  jumper.call("layout.listenForElements", {
    listenElementLayoutConfigSteps: [
      {
        action: "querySelector",
        value: "#commentbox #submit-button",
      },
    ],
    targetQuerySelector: "button",
    observerConfig: { childList: true },
  }, handleMatches);

  // when mutation observer finds buttons, we see if it's a like button, subscribe button, etc...
  // and if it is, log the metric for creators
  function handleMatches(matches) {
    const buttonInfos = matches
      .map((match) => getButtonInfoFromMatch(match))
      .filter(Boolean);

    buttonInfos.forEach(({ metricSlug, id }) => {
      // when this button is clicked, record an event
      jumper.call("layout.addEventListener", {
        eventName: "click",
        targetElementLayoutConfigSteps: [
          {
            action: "querySelector",
            value: `[data-truffle-id=${id}]`,
          },
        ],
      }, () => {
        recordMetric(metricSlug);
      });
    });
  }
}

function getDatapointFiltersFromExtensionInfo(
  extensionInfo,
): { youtubeChannelId: string; youtubeVideoId: string } | null {
  const pageInfo = extensionInfo?.pageInfo?.find((pageInfo) =>
    pageInfo.sourceType === "youtubeVideo"
  );
  return pageInfo
    ? {
      youtubeChannelId: pageInfo.sourceId,
      youtubeVideoId: pageInfo.data?.videoId,
    }
    : null;
}

function getButtonInfoFromMatch(match): ButtonInfo | null {
  const text = match.innerText;
  const ariaLabelLowercase =
    match.attributes["aria-label"]?.trim().toLowerCase() || "";

  let metricSlug;
  if (text === "Comment") metricSlug = "youtube-button-comments";
  if (text === "Subscribe") metricSlug = "youtube-button-subscribes";
  if (text === "Join") metricSlug = "youtube-button-joins";
  if (text === "Share") metricSlug = "youtube-button-shares";
  // sometimes youtube shows different aria text
  if (
    ariaLabelLowercase.startsWith("like this") ||
    ariaLabelLowercase.endsWith("likes")
  ) {
    metricSlug = "youtube-button-likes";
  }
  if (ariaLabelLowercase.startsWith("dislike this")) {
    metricSlug = "youtube-button-dislikes";
  }

  if (metricSlug) {
    return { metricSlug, id: match.id };
  } else {
    return null;
  }
}
