import { FASTElement } from "https://npm.tfl.dev/@microsoft/fast-element@2.0.0-beta.3";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.5/format/wc/fast/index.ts";
import isSsr from "https://tfl.dev/@truffle/utils@~0.0.3/ssr/is-ssr.ts";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.3/jumper/jumper.ts";

if (!isSsr) {
  console.log("applying css fixes");

  jumper.call("layout.applyLayoutConfigSteps", {
    layoutConfigSteps: [
      {
        action: "setStyleSheet",
        value: {
          id: "theater-mode",
          css: `
          /* Make the masthead transparent unless we are hovering it */
          body[data-mogul-theater-mode] #masthead-container {
            opacity: 0.1;
            transition: opacity 0.2s ease;
          }
          
          body[data-mogul-theater-mode] #masthead-container:hover {
            opacity: 1;
          }
          /* https://discord.com/channels/839188384752599071/1123706607168143400 */
          @media screen and (min-width: 1014px) {
            /* Make chat fill screen vertically */
            body[data-mogul-theater-mode] #chat.ytd-watch-flexy {
              height: calc(100vh - 56px) !important;
              width: var(--ytd-watch-flexy-sidebar-width);
              position: absolute !important;
              top: 56px;
              right: 0;
            }
          
            body[data-mogul-theater-mode] #player-full-bleed-container.ytd-watch-flexy {
              width: calc(100vw - var(--ytd-watch-flexy-sidebar-width) - var(--ytd-watch-flexy-scrollbar-width)) !important;
              max-width: calc(100vw - var(--ytd-watch-flexy-sidebar-width) - var(--ytd-watch-flexy-scrollbar-width)) !important;
              height: calc(100vh - 56px) !important;
              max-height: calc(100vh - 56px) !important;
            }
          
            body[data-mogul-theater-mode] #secondary.ytd-watch-flexy {
              position: unset;
            }
          }
          
          `,
        },
      },
    ],
  });
}

// empty web component (don't need to render any ui)
export default toDist({ Class: FASTElement }, import.meta.url);
