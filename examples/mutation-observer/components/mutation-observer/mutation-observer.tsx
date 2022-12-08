import React, { useEffect } from "https://npm.tfl.dev/react";
import randomColor from "https://npm.tfl.dev/randomcolor@~0.6.2";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";
// import { getOrgId } from "https://tfl.dev/@truffle/utils@~0.0.2/site/site.ts";
import { gql, query } from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";

// const GET_ORG_USER_QUERY = gql`query ConnectionGet ($input: ConnectionInput!) {
//   connection(input: $input) {
//     orgUser {
//       name
//     }
//   }
// }`;

function MutationObserver() {
  useEffect(() => {
    jumper.call("layout.listenForElements", {
      listenElementLayoutConfigSteps: [
        {
          action: "querySelector",
          value: "ytd-comments#comments ytd-item-section-renderer #contents",
        },
      ],
      observerConfig: { childList: true, subtree: true },
      targetQuerySelector: "ytd-comment-thread-renderer",
      shouldCleanupMutatedElements: true,
    }, onEmit);
  }, []);

  return <></>;
}

function onEmit(matches) {
  matches.forEach((match) => {
    const { id: elementId, data } = match;
    const authorId = data?.comment?.commentRenderer?.authorEndpoint
      ?.browseEndpoint?.browseId;
    console.log("Youtube comments!", { match, authorId });

    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        { action: "querySelector", value: `[data-truffle-id="${elementId}"]` },
        {
          action: "setStyle",
          value: JSON.stringify({ border: `2px solid ${randomColor()}` }),
        },
      ],
      mutatedElementId: elementId,
    });

    // NOTE: this won't return anything for 99.99% of commenters since we're using our staging data
    // you can manually add a connection for your org and sourceType: 'youtube', sourceId: your YouTube id
    // in the GraphQL API
    // const orgUserResponse = await query(GET_ORG_USER_QUERY, {
    //   input: {
    //     sourceType: "youtube",
    //     sourceId: authorId,
    //     orgId: getOrgId(),
    //   },
    // });
    // const orgUser = orgUserResponse.data.connection?.orgUser;
  });
}

export default MutationObserver;
