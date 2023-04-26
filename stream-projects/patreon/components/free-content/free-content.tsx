import React, { useEffect, useState } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import { useSignal } from "https://tfl.dev/@truffle/state@~0.0.8/mod.ts";
import { useSelector } from "https://npm.tfl.dev/@legendapp/state@~0.19.0/react";

import styleSheet from "./patreon-iframe.scss.js";

const TEN_MINUTES_MS = 10 * 60 * 1000;
const VIDEO_LENGTH = 50 * 60 * 1000; // 50 min (HACK: presumably all yard/wine about it are this long)

const start = Date.now();

const KEY_VALUE_UPSERT_MUTATION = gql`
  mutation KeyValueUpsert($input: KeyValueUpsertInput!) {
    keyValueUpsert(input: $input) {

    } 
  }`;

function FreeContent({ url, isHidden }: { url: string; isHidden?: boolean }) {
  // TODO: check if video has been liked
  // TODO: check if channel is sub'd to
  // TODO: wait for length of video
  // TODO: when all of above, create KV
  const isLiked$ = useSignal(false);
  const isLiked = useSelector(() => isLiked$.get());
  const isSubscribed$ = useSignal(false);
  const isSubscribed = useSelector(() => isSubscribed$.get());
  const hasWatched$ = useSignal(false);
  const hasWatched = useSelector(() => hasWatched$.get());

  useEffect(() => {
    if (isLiked && isSubscribed && hasWatched) {
      mutation(KEY_VALUE_UPSERT_MUTATION, {
        input: {
          key: "hasWatched", // FIXME: video id
          value: true,
        },
      });
    }
  }, [isLiked, isSubscribed, hasWatched]);
}

export default FreeContent;
