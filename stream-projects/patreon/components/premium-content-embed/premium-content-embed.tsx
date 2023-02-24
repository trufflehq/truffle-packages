import React, { useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import { useGoogleFontLoader } from "https://tfl.dev/@truffle/utils@~0.0.3/google-font-loader/mod.ts";
import {
  gql,
  useMutation,
} from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";
import { useSignal } from "https://tfl.dev/@truffle/state@~0.0.8/mod.ts";
import { useSelector } from "https://npm.tfl.dev/@legendapp/state@~0.19.0/react";
import Icon from "https://tfl.dev/@truffle/ui@~0.2.0/components/legacy/icon/icon.tsx";

import PatreonIframe from "../patreon-iframe/patreon-iframe.tsx";
import styleSheet from "./premium-content-embed.scss.js";

const CLOSE_ICON_PATH =
  "M19,6.41 L17.59,5 L12,10.59 L6.41,5 L5,6.41 L10.59,12 L5,17.59 L6.41,19 L12,13.41 L17.59,19 L19,17.59 L13.41,12 L19,6.41 Z";
const EXPAND_ICON_PATH =
  "M14 21v-2h3.59l-4.5-4.5 1.41-1.41 4.5 4.5V14h2v7h-7M9.5 10.91L5 6.41V10H3V3h7v2H6.41l4.5 4.5-1.41 1.41z";
const PATREON_ICON_PATH =
  "M4.23146 0.421875V23.5172H0V0.421875H4.23146ZM15.3429 0.421875C20.1241 0.421875 24 4.29781 24 9.07902C24 13.8602 20.1241 17.7362 15.3429 17.7362C10.5616 17.7362 6.68571 13.8602 6.68571 9.07902C6.68571 4.29781 10.5616 0.421875 15.3429 0.421875Z";
const OPEN_IN_NEW_ICON_PATH =
  "M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z";

const VISIBLE_STYLE = {
  width: "100%",
  height: "338px", // in case aspect-ratio isn't supported
  display: "block", // need to replace hidden style
  "margin-bottom": "12px",
  background: "transparent",
};

const COLLAPSED_STYLE = {
  ...VISIBLE_STYLE,
  height: "32px",
};

const DATAPOINT_INCREMENT_METRIC_MUTATION = gql`
mutation DatapointIncrementUnique ($input: DatapointIncrementUniqueInput!) {
  datapointIncrementUnique(input: $input) { isUpdated }
}`;

function Embed({ url, patreonUsername, title, previewImageSrc }) {
  useStyleSheet(styleSheet);
  useGoogleFontLoader(() => ["Roboto"]);
  const tierName$ = useSignal("");
  const tierName = useSelector(() => tierName$.get());

  const [_incrementUniquePayload, executeDatapointIncrementUniqueMutation] =
    useMutation(
      DATAPOINT_INCREMENT_METRIC_MUTATION,
    );

  const isCollapsed$ = useSignal(false);
  const isCollapsed = useSelector(() => isCollapsed$.get());

  useEffect(() => {
    // set styles for this iframe within YouTube's site
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        { action: "useSubject" }, // start with our iframe
        {
          action: "setStyle",
          value: isCollapsed ? COLLAPSED_STYLE : VISIBLE_STYLE,
        },
      ],
    });
  }, [isCollapsed]);

  useEffect(() => {
    jumper.call("comms.onMessage", (message) => {
      if (message?.type === "patreon.tierName") {
        tierName$.set(message.body);

        executeDatapointIncrementUniqueMutation({
          input: {
            metricSlug: "unique-patreon-premium-content-embed-views",
            dimensionValues: {
              "patreon-tier-name": message.body || "none",
            },
          },
        });
      }
    });
  }, []);

  const recordClick = (e) => {
    e?.stopPropagation();

    const shouldEmbed = tierName$.get();
    if (shouldEmbed) {
      e?.preventDefault();
      jumper.call("comms.postMessage", {
        type: "patreon.embedVideo",
        body: { url },
      });
    }

    // FIXME: set cookie for 1 hour and see if they join patreon bc of us
    // setCookie("patreon-click", "true", 1);

    executeDatapointIncrementUniqueMutation({
      input: {
        metricSlug: "unique-patreon-premium-content-embed-clicks",
        dimensionValues: {
          "patreon-tier-name": tierName$.get() || "none",
        },
      },
    });
  };

  const toggle = (e) => {
    e?.stopPropagation();
    e?.preventDefault();
    isCollapsed$.set(!isCollapsed$.get());
  };

  return (
    <>
      <PatreonIframe
        url={`https://www.patreon.com/${patreonUsername}/membership?embed`}
        isHidden={true}
      />
      <a
        className={`c-premium-content-embed ${
          isCollapsed ? "is-collapsed" : ""
        }`}
        href={url}
        target="_blank"
        onClick={recordClick}
      >
        <div className="top">
          <div className="icon">
            <Icon
              icon={PATREON_ICON_PATH}
              size="24px"
              color="#FF424D"
            />
          </div>
          <div className="info">
            <div className="title">Premium content</div>
            {
              <div className="description">
                {tierName
                  ? "Thanks for being a patron"
                  : "Unlock this video by becoming a patron"}
              </div>
            }
          </div>
          <div className="close">
            <Icon
              icon={isCollapsed ? EXPAND_ICON_PATH : CLOSE_ICON_PATH}
              onclick={toggle}
              size="18px"
              color={"#FFFFFF"}
            />
          </div>
        </div>
        <div className="content">
          <div className="preview">
            <div
              className="background"
              style={{
                backgroundImage: `url(${previewImageSrc})`,
              }}
            >
            </div>
            {!tierName
              ? (
                <div className="lock">
                  <LockIcon />
                </div>
              )
              : null}
            <a
              className="button"
              href={url}
              target="_blank"
              onClick={recordClick}
            >
              <Icon
                icon={OPEN_IN_NEW_ICON_PATH}
                size="24px"
                color="#000"
              />
              Watch now
            </a>
          </div>
          <div className="info">
            <div className="title">
              {title}
            </div>
            {/* <div className="description">129 likes · 3 days ago</div> */}
          </div>
        </div>
      </a>
    </>
  );
}

export default Embed;

function LockIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_110_809)">
        <path
          d="M30 13.3333H28.3333V9.99999C28.3333 5.39999 24.6 1.66666 20 1.66666C15.4 1.66666 11.6667 5.39999 11.6667 9.99999V13.3333H9.99999C8.16666 13.3333 6.66666 14.8333 6.66666 16.6667V33.3333C6.66666 35.1667 8.16666 36.6667 9.99999 36.6667H30C31.8333 36.6667 33.3333 35.1667 33.3333 33.3333V16.6667C33.3333 14.8333 31.8333 13.3333 30 13.3333ZM20 28.3333C18.1667 28.3333 16.6667 26.8333 16.6667 25C16.6667 23.1667 18.1667 21.6667 20 21.6667C21.8333 21.6667 23.3333 23.1667 23.3333 25C23.3333 26.8333 21.8333 28.3333 20 28.3333ZM15 13.3333V9.99999C15 7.23332 17.2333 4.99999 20 4.99999C22.7667 4.99999 25 7.23332 25 9.99999V13.3333H15Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_110_809">
          <rect width="40" height="40" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
