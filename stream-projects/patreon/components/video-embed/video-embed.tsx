import React, { useEffect, useRef } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import { useGoogleFontLoader } from "https://tfl.dev/@truffle/utils@~0.0.3/google-font-loader/mod.ts";
import {
  signal,
  useSignal,
} from "https://tfl.dev/@truffle/state@~0.0.8/mod.ts";
import { useSelector } from "https://npm.tfl.dev/@legendapp/state@~0.19.0/react";
import Icon from "https://tfl.dev/@truffle/ui@~0.2.0/components/legacy/icon/icon.tsx";
import { gql, mutation } from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";

import PatreonIframe from "../patreon-iframe/patreon-iframe.tsx";
import styleSheet from "./video-embed.scss.js";
import { Checkmark, YardLogo } from "./svgs.tsx";
import type { VideoInfo } from "../../types/index.ts";

const PREVIEW_LENGTH_MS = 30000; // 30s

const VISIBLE_STYLE = {
  width: "100%",
  height: "100%",
  // can't actually do this calc() below. it works for non-theater-mode, but breaks down in
  // theater mode and fullscreen. only works non-theater if we put in #player (bc of overflow hidden)
  // but the player isn't in #player in theater mode.
  // height: "calc(100% + 40px)", // space for full-size patreon video + info bar
  display: "block", // need to replace hidden style
  position: "absolute",
  top: 0,
  left: 0,
  "z-index": 99,
};

const HIDDEN_STYLE = {
  display: "none",
};

const CLOSE_ICON_PATH =
  "M19,6.41 L17.59,5 L12,10.59 L6.41,5 L5,6.41 L10.59,12 L5,17.59 L6.41,19 L12,13.41 L17.59,19 L19,17.59 L13.41,12 L19,6.41 Z";
const PATREON_ICON_PATH =
  "M4.23146 0.421875V23.5172H0V0.421875H4.23146ZM15.3429 0.421875C20.1241 0.421875 24 4.29781 24 9.07902C24 13.8602 20.1241 17.7362 15.3429 17.7362C10.5616 17.7362 6.68571 13.8602 6.68571 9.07902C6.68571 4.29781 10.5616 0.421875 15.3429 0.421875Z";
const OPEN_IN_NEW_ICON_PATH =
  "M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z";

const DATAPOINT_INCREMENT_UNIQUE_MUTATION = gql`
mutation DatapointIncrementUnique ($input: DatapointIncrementUniqueInput!) {
  datapointIncrementUnique(input: $input) { isUpdated }
}`;

// TODO: replace w/ value from db or props
const TIERS = [
  {
    id: "7158347",
    name: "shill",
    priceCents: 500,
    bullets: [
      "Premium episodes",
      "Access to The Yard Discord",
    ],
  },
  {
    id: "7158348",
    name: "rich king",
    priceCents: 1500,
    bullets: [
      "shill benefits",
      "Secret shows",
      "Behind the scenes content",
    ],
  },
  {
    id: "7158349",
    name: "shillionaire",
    priceCents: 2500,
    bullets: [
      "shill and rich king benefits",
      "WE WILL ACTUALLY MAIL TO YOUR HOUSE: a custom postcard every month with a trinket chosen at random, or a shirtless polaroid",
      "Discounts and early access to merch",
    ],
  },
];

export default function VideoEmbed() {
  useStyleSheet(styleSheet);
  useGoogleFontLoader(() => ["Roboto"]);

  const isPatreonVideoReady$ = useSignal(false);
  const isPatreonVideoReady = useSelector(() => isPatreonVideoReady$.get());
  const videoInfo$ = useSignal<VideoInfo | undefined>();
  const videoInfo = useSelector(() => videoInfo$.get());
  const isUpsellVisible$ = useSignal(false);
  const isUpsellVisible = useSelector(() => isUpsellVisible$.get());

  useEffect(() => {
    jumper.call("comms.onMessage", (message) => {
      if (message.type === "patreon.showVideoEmbed") {
        // sent from premium-content embed when clicking play
        videoInfo$.set(message.body.videoInfo);
      } else if (message.type === "patreon.videoReady") {
        // sent from our patreon embed when page has loaded
        isPatreonVideoReady$.set(true);
      }
    });
  }, []);

  useEffect(() => {
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        { action: "useSubject" }, // start with our iframe
        {
          action: "setStyle",
          value: videoInfo ? VISIBLE_STYLE : HIDDEN_STYLE,
        },
      ],
    });
  }, [JSON.stringify(videoInfo)]);

  const close = () => {
    isPatreonVideoReady$.set(false);
    videoInfo$.set(null);
  };

  if (!videoInfo) {
    return <></>;
  }

  if (isUpsellVisible) {
    return <PatreonUpsell close={close} />;
  }

  const { isPatron, url, title } = videoInfo;

  if (isPatron) {
    return (
      <div className="c-video-embed">
        <VideoInfoBar
          title={title}
          buttonUrl={url}
          buttonText="Watch on Patreon"
          buttonIconPath={OPEN_IN_NEW_ICON_PATH}
          close={close}
        />
        <PatreonVideo
          url={url}
          isPatreonVideoReady={isPatreonVideoReady}
        />
      </div>
    );
  } else {
    return (
      <div className="c-video-embed">
        <VideoInfoBar
          title={title}
          subtitle="Premium content Preview playing"
          buttonOnClick={() => isUpsellVisible$.set(true)}
          buttonText="Unlock full video"
          buttonIconPath={OPEN_IN_NEW_ICON_PATH} // TODO: lock icon?
          close={close}
        />
        <PremiumPreview isUpsellVisible$={isUpsellVisible$} />
      </div>
    );
  }
}

function PremiumPreview(
  { isUpsellVisible$ }: { isUpsellVisible$: signal<boolean> },
) {
  const timeoutRef = useRef<number>();

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isUpsellVisible$.set(true);
    }, PREVIEW_LENGTH_MS);
  }, []);

  return (
    <div className="c-premium-preview">
      <iframe
        src="https://player.vimeo.com/video/806550009?h=d1c3d5121d&badge=0&autoplay=1&player_id=0&app_id=58479"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        style={{
          width: "100%",
          height: "99%",
        }}
        title="ep. 86 preview"
      >
      </iframe>
    </div>
  );
}

function PatreonUpsell({ close }: { close: () => void }) {
  const onClick = () => {
    mutation(DATAPOINT_INCREMENT_UNIQUE_MUTATION, {
      input: {
        metricSlug: "unique-patreon-join-clicks",
      },
    });
  };

  return (
    <div className="c-patreon-upsell">
      <div className="close" onClick={close}>
        <Icon
          icon={CLOSE_ICON_PATH}
          size="20px"
          color="#fff"
          onclick={close}
        />
      </div>
      <div className="header">
        <div className="icon">
          <YardLogo />
        </div>
        <div className="info">
          <div className="subtitle">
            Premium content Preview Ended
          </div>
          <div className="title">
            Support The Yard and unlock exclusive content and more:
          </div>
        </div>
      </div>
      <div className="tiers">
        {TIERS.map((tier) => (
          <div className="tier">
            <div className="title">
              {tier.name}
            </div>
            <div className="info">
              <div className="price">
                ${Math.round(100 * tier.priceCents / (100 * 100))} / month
              </div>

              <a
                className="button"
                href={`https://www.patreon.com/checkout/theyard/${tier.id}`}
                onClick={onClick}
                target="_blank"
              >
                Join
              </a>

              <div className="bullets">
                <div className="label">You get:</div>
                {tier.bullets.map((bullet) => (
                  <div className="bullet">
                    <div className="checkmark">
                      <Checkmark />
                    </div>
                    {bullet}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PatreonVideo(
  { isPatreonVideoReady, url }: { isPatreonVideoReady: boolean; url: string },
) {
  return (
    <div
      className={`c-patreon-video 
        ${isPatreonVideoReady ? "is-visible" : ""}`}
    >
      <div className="iframe-wrapper">
        <PatreonIframe url={`${url}?embed`} />
      </div>
      <div className="loading">Loading Patreon video</div>
    </div>
  );
}

function VideoInfoBar(
  {
    title,
    subtitle,
    buttonUrl,
    buttonOnClick,
    buttonText,
    buttonIconPath,
    close,
  }: {
    title: string;
    subtitle?: string;
    buttonUrl?: string;
    buttonOnClick?: () => void;
    buttonText: string;
    buttonIconPath: string;
    close: () => void;
  },
) {
  return (
    <div className="c-video-info-bar">
      <div className="icon">
        <Icon
          icon={PATREON_ICON_PATH}
          size="24px"
          color="#FF424D"
        />
      </div>
      <div className="info">
        {subtitle ? <div className="subtitle">{subtitle}</div> : null}
        <div className="title">
          {title || ""}
        </div>
      </div>

      <a
        href={buttonUrl}
        onClick={buttonOnClick}
        target="_blank"
        className="button"
      >
        <Icon
          icon={buttonIconPath}
          size="16px"
          color="#fff"
        />
        {buttonText}
      </a>

      <div className="close">
        <Icon
          icon={CLOSE_ICON_PATH}
          size="20px"
          color="#fff"
          onclick={close}
        />
      </div>
    </div>
  );
}
