import { stripIndent } from "https://npm.tfl.dev/common-tags";
import PropTypes from "https://npm.tfl.dev/prop-types@15";
import React, { useEffect } from "https://npm.tfl.dev/react";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.5/format/wc/react/index.ts";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.17/jumper/jumper.ts";
import {
  enableLegendStateReact,
  useObservable,
  useObserve,
  useSelector,
} from "https://npm.tfl.dev/@legendapp/state@0.18.6/react";

enableLegendStateReact();

import styleSheet from "./chant.css.js";
import { MatchedMessage, Run } from "./types.ts";

const parseChant = (message: MatchedMessage): null | Required<Run> => {
  const runs = message.data.message.runs;
  // `runs` has the type `[ { emoji: [Object] }, { text: '' } ]` -- we want to ensure that one of the objects has a `text` property, and that the other has an `emoji` property
  const textRun = runs.find((run) => typeof run.text === "string");
  const emojiRun = runs.find((run) => typeof run.emoji === "object");
  // text should be empty and emoji should be an object
  const isChant = !textRun?.text?.length && emojiRun?.emoji?.emojiId;
  return isChant ? (emojiRun as Required<Run>) : null;
};

export default function Chants({ initialCount }: { initialCount: number }) {
  useStyleSheet(styleSheet);

  const state = useObservable({
    /**
     * the id of the emoji that is currently being chanted
     */
    emoji: "",
    /**
     * the src of the emoji that is currently being chanted
     */
    emoji_src: "",
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
     * the element id of the header -- in an attempt to make it a rainbow loop
     */
    header_id: "",
  });

  // pull header background id
  useEffect(() => {
    function onEmit(matches: { id: string }[]) {
      console.log("matched header!");
      console.dir(matches);
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
      onEmit
    );
  }, [true]);

  // monitor `state.pillBackground` and set the header background to it
  useObserve(() => {
    const id = state.header_id.get();
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        {
          action: "addStyleSheet",
          value: {
            id: "header_style",
            css: `
            [data-truffle-id="${id}"] {
              background: ${state.pillBackground.get()};
              animation: 3s linear infinite rainbow;
              background-size: 400% 400%
            }`,
          },
        },
      ],
      mutatedElementId: id,
    });
  });

  useObserve(() => {
    console.log({
      emoji: state.emoji.get(),
      emoji_src: state.emoji_src.get(),
      count: state.count.get(),
      show: state.show.get(),
      animation: state.animation.get(),
      pillBackground: state.pillBackground.get(),
      header_id: state.header_id.get(),
    });
  });

  // convert the jumper.call onEmit function into an event emitter
  const target = new EventTarget();
  useEffect(() => {
    console.log("setup target");
    // log an object of the state
    target.addEventListener("message", (event) => {
      const { detail: message } = event as CustomEvent<MatchedMessage>;

      const chant = parseChant(message);
      // if the message is not a chant, clear the chant!
      if (!chant) {
        state.emoji.set("");
        state.emoji_src.set("");
        state.count.set(0);
        state.show.set(false);
        state.animation.set("");
        state.pillBackground.set("");
        return;
      }
      console.dir(message);

      // if the chant is the same as the previous chant, increment the count
      if (state.emoji.get() === chant.emoji!.emojiId) {
        return state.count.set((prev) => prev + 1);
      }

      // otherwise, reset the chant
      state.emoji.set(chant.emoji!.emojiId);
      state.emoji_src.set(chant.emoji!.image.thumbnails[0].url);
      state.count.set(1);
      state.show.set(false);
      state.animation.set("");
      state.pillBackground.set("");
    });
  }, [true]);

  // listen for new chat messages
  useEffect(() => {
    const onEmit = (matches: MatchedMessage[]) => {
      for (const match of matches) {
        const e = new CustomEvent("message", { detail: match });
        target.dispatchEvent(e);
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
      onEmit
    );
  }, [true]);

  // monitors `state.count` and `state.show` and
  // controls the animations and effects as the count changes
  useObserve(() => {
    state.animation.set("");

    const count = state.count.get();
    new Promise((resolve) => setTimeout(resolve, 10)).then(() =>
      state.animation.set("pop 0.3s ease-in-out")
    );

    if (!state.show.get() && count >= 3) state.show.set(true);
    if (count >= 5)
      return state.pillBackground.set(
        "linear-gradient(to right, #FF73D8, #FFBA53, #F0DE37, #41EEE4, #C2A2F8, #FF73D8), #FFFFFF"
      );
    if (count <= 3) return;
  });

  const emojiSrc = useSelector(state.emoji_src);
  const show = useSelector(state.show);
  const background = useSelector(state.pillBackground);
  return show ? (
    <>
      <div
        className="chant-container"
        style={{
          width: "80px",
          height: "36px",
          borderRadius: "22px",
          background,
          backgroundSize: "1800% 1800%",
          animation: "rainbow 3s linear infinite",
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          alignItems: "center",
          paddingLeft: "10px",
          paddingRight: "12px",
        }}
      >
        <img
          className="emoji"
          src={emojiSrc}
          width={"24px"}
          style={{ marginTop: "3px", marginBottom: "3px" }}
        />
        <div
          className="count"
          style={{
            display: "flex",
            color: "black",
            fontFamily: "Hobeaux",
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: "11px",
            lineHeight: "16px",
            letterSpacing: "0.0025em",
            // animation: "pop 0.25s ease-in-out",
          }}
        >
          <p style={{ animation: state.animation.get(), paddingRight: "3px" }}>
            {state.count}x
          </p>
          <p>combo</p>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
}
