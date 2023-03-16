import jumper from "https://tfl.dev/@truffle/utils@~0.0.3/jumper/jumper.ts";
import { gql, mutation } from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";

const DATAPOINT_INCREMENT_METRIC_MUTATION = gql`
mutation DatapointIncrementMetric ($input: DatapointIncrementMetricInput!) {
  datapointIncrementMetric(input: $input) { isUpdated }
}`;

type ButtonInfo = {
  metricSlug: string;
  id: string;
};

const extensionInfo = jumper.call(
  "context.getInfo",
);

const recordClick = async (
  metricSlug: string,
): Promise<void> => {
  mutation(DATAPOINT_INCREMENT_METRIC_MUTATION, {
    input: {
      metricSlug,
      count: 1,
      filterValues: getFiltersFromExtensionInfo(await extensionInfo),
    },
  });
};

// TODO: may need to change #top-row and #comment-box #submit-button to body
// if they don't exist when iframe is loaded in.
// drawback is it's less performant since we run the handleMatches fn any time anything
// change in any part of dom
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
      recordClick(metricSlug);
    });
  });
}

function getFiltersFromExtensionInfo(
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
  if (text === "Comment") metricSlug = "youtube-button-comment";
  if (text === "Subscribe") metricSlug = "youtube-button-subscribe";
  if (text === "Join") metricSlug = "youtube-button-join";
  if (text === "Share") metricSlug = "youtube-button-share";
  // sometimes youtube shows different aria text
  if (
    ariaLabelLowercase.startsWith("like this") ||
    ariaLabelLowercase.endsWith("likes")
  ) {
    metricSlug = "youtube-button-like";
  }
  if (ariaLabelLowercase.startsWith("dislike this")) {
    metricSlug = "youtube-button-dislike";
  }

  if (metricSlug) {
    return { metricSlug, id: match.id };
  } else {
    return null;
  }
}
