// @deno-types="https://npm.tfl.dev/v86/@types/react@~18.0/index.d.ts"
import React, { useEffect } from "https://npm.tfl.dev/react";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.19/format/wc/react/index.ts";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.17/jumper/jumper.ts";
import {
  enableLegendStateReact,
  observer,
  useObserve,
  useSelector,
} from "https://npm.tfl.dev/@legendapp/state@~0.19.0/react";
import { useSignal } from "https://tfl.dev/@truffle/state@~0.0.2/signals/hooks.ts";
import { useGoogleFontLoader } from "https://tfl.dev/@truffle/utils@~0.0.17/google-font-loader/mod.ts";

enableLegendStateReact();

import styleSheet from "./chant.scss.js";
import { MatchedMessage, Run } from "./types.ts";

const DEFAULT_SHOW_PILL_COUNT = 5;
const DEFAULT_SHOW_HEADER_BG_COUNT = 10;
const parseChant = (message: MatchedMessage): null | Required<Run> => {
  const runs = message.data.message.runs;
  // `runs` has the type `[ { emoji: [Object] }, { text: '' } ]`
  // we want to ensure that one of the objects has a `text` property
  const textRun = runs.find((run) => typeof run.text === "string");
  // and that the other has an `emoji` property
  const emojiRun = runs.find((run) => typeof run.emoji === "object");
  // text should be empty and emoji should be an object
  const isChant = !textRun?.text?.length && emojiRun?.emoji?.emojiId;
  return isChant ? (emojiRun as Required<Run>) : null;
};

function Chants(
  {
    showPillCount = DEFAULT_SHOW_PILL_COUNT,
    showBgCount = DEFAULT_SHOW_HEADER_BG_COUNT,
  }: { showPillCount?: number; showBgCount?: number },
) {
  useStyleSheet(styleSheet);

  useGoogleFontLoader(() => ["Bebas Neue"], []);

  const state = useSignal<{
    emoji: Run["emoji"];
    emojiSrc: string;
    count: number;
    show: boolean;
    animation: string;
    pillBackground: string;
    headerBackground: string;
    header_id: string;
  }>({
    /**
     * the id of the emoji that is currently being chanted
     */
    emoji: undefined,
    /**
     * the src of the emoji that is currently being chanted
     */
    emojiSrc: "",
    /**
     * the number of times the emoji has been chanted
     */
    count: 0,
    /**
     * whether or not to show the chant pill
     */
    show: false,
    /**
     * what the current animation should be on the number display (eg: "3x")
     */
    animation: "",
    /**
     * the background gradient of the chant pill
     */
    pillBackground: "",

    /**
     * the background of the header
     */
    headerBackground: "",
    /**
     * the element id of the header -- in an attempt to make it a rainbow loop
     */
    header_id: "",
  });

  // pull header background id
  useEffect(() => {
    function onEmit(matches: { id: string }[]) {
      state.header_id.set(matches[0].id);
    }

    jumper.call(
      "layout.listenForElements",
      {
        listenElementLayoutConfigSteps: [
          { action: "querySelector", value: "#chatframe" },
          { action: "getIframeDocument" },
          { action: "querySelector", value: "#chat-messages" },
        ],
        observerConfig: { childList: true, subtree: true },
        targetQuerySelector: "yt-live-chat-header-renderer",
        shouldCleanupMutatedElements: true,
      },
      onEmit,
    );
  }, []);

  // monitor `state.pillBackground` and set the header background to it
  useObserve(() => {
    const id = state.header_id.get();
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        {
          action: "setStyleSheet",
          value: {
            id: "chants-header-style",
            css: `
            [data-truffle-id="${id}"] {
              background: ${state.headerBackground.get()};
              background-size: 1800% 1800%;

              -webkit-animation: rainbow 8s linear infinite;
              -z-animation: rainbow 8s linear infinite;
              -o-animation: rainbow 8s linear infinite;
              animation: rainbow 8s linear infinite;
            }

            @-webkit-keyframes rainbow {
              0%{background-position:0% 82%}
              50%{background-position:100% 19%}
              100%{background-position:0% 82%}
            }
            @-moz-keyframes rainbow {
              0%{background-position:0% 82%}
              50%{background-position:100% 19%}
              100%{background-position:0% 82%}
            }
            @-o-keyframes rainbow {
              0%{background-position:0% 82%}
              50%{background-position:100% 19%}
              100%{background-position:0% 82%}
            }
            @keyframes rainbow { 
              0%{background-position:0% 82%}
              50%{background-position:100% 19%}
              100%{background-position:0% 82%}
            }
            
            `,
          },
        },
      ],
      mutatedElementId: id,
    });
  });

  // convert the jumper.call onEmit function into an event emitter
  const target = new EventTarget();
  useEffect(() => {
    // log an object of the state
    target.addEventListener("message", (event) => {
      const { detail: message } = event as CustomEvent<MatchedMessage>;
      const chant = parseChant(message);

      // if the message is not a chant, clear the chant!
      if (!chant) {
        state.emoji.set(undefined);
        state.emojiSrc.set("");
        state.count.set(0);
        state.show.set(false);
        state.animation.set("");
        state.pillBackground.set("");
        state.headerBackground.set("");
        return;
      }

      // if the chant is the same as the previous chant, increment the count
      if (state.emoji.get()?.emojiId === chant.emoji!.emojiId) {
        return void state.count.set((prev) => prev + 1);
      }

      // otherwise, reset the chant
      state.emoji.set(chant.emoji!);
      state.emojiSrc.set(chant.emoji!.image.thumbnails[0].url);
      state.count.set(1);
      state.show.set(false);
      state.animation.set("");
      state.pillBackground.set("");
      state.headerBackground.set("");
    });
  }, []);

  // listen for new chat messages
  useEffect(() => {
    const onEmit = (matches: MatchedMessage[]) => {
      for (const match of matches) {
        target.dispatchEvent(new CustomEvent("message", { detail: match }));
      }
    };

    jumper.call(
      "layout.listenForElements",
      {
        listenElementLayoutConfigSteps: [
          { action: "querySelector", value: "#chatframe" },
          { action: "getIframeDocument" },
          { action: "querySelector", value: "#item-scroller #items" },
        ],
        observerConfig: { childList: true, subtree: true },
        targetQuerySelector: "yt-live-chat-text-message-renderer",
        shouldCleanupMutatedElements: true,
      },
      onEmit,
    );
  }, []);

  // monitors `state.count` and `state.show` and
  // controls the animations and effects as the count changes
  useObserve(() => {
    state.animation.set("");

    const count = state.count.get();

    new Promise((resolve) => setTimeout(resolve, 10)).then(() =>
      state.animation.set("pop 0.3s ease-in-out")
    );

    if (!state.show.get() && count >= showPillCount) state.show.set(true);
    if (count >= showBgCount) {
      return state.headerBackground.set(
        "linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3)",
      );
    }
  });

  const emojiSrc = useSelector(state.emojiSrc);
  const show = useSelector(state.show);
  const animation = useSelector(state.animation);
  const background = useSelector(state.background);
  const count = useSelector(state.count);
  const emoji = useSelector(state.emoji);

  const setChatInput = (value: string) => {
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        {
          action: "querySelector",
          value: "yt-live-chat-text-input-field-renderer",
        },
        {
          action: "webComponentMethod",
          value: {
            method: "setText",
            args: [value],
          },
        },
        {
          action: "webComponentMethod",
          value: {
            method: "setFocus_",
            args: [true],
          },
        },
        {
          action: "webComponentMethod",
          value: {
            method: "fire",
            args: ["yt-live-chat-send-message"],
          },
        },
      ],
    });
  };

  return show
    ? (
      <div className="c-chants">
        <div
          className="chant-container"
          onClick={() => setChatInput(`${emoji?.shortcuts[0]}`)}
        >
          <img className="emoji" src={emojiSrc} width={"24px"} />
          <div className="count">
            <p style={{ animation, paddingRight: "3px" }}>{`${count}x`}</p>
            <p>combo</p>
          </div>
        </div>
      </div>
    )
    : <></>;
}

export default observer(Chants);
