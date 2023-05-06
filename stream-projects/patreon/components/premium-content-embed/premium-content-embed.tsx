import React, { useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import { useGoogleFontLoader } from "https://tfl.dev/@truffle/utils@~0.0.3/google-font-loader/mod.ts";
import {
  gql,
  useMutation,
  useQuery,
} from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";
import { useSignal } from "https://tfl.dev/@truffle/state@~0.0.8/mod.ts";
import { setCookie } from "https://tfl.dev/@truffle/utils@~0.0.3/cookie/cookie.ts";
import { useSelector } from "https://npm.tfl.dev/@legendapp/state@~0.19.0/react";
import Icon from "https://tfl.dev/@truffle/ui@~0.2.0/components/legacy/icon/icon.tsx";
import semver from "https://npm.tfl.dev/semver@7.3.7";

import { tierName$ } from "../../lib/detect.ts";
import PatreonIframe from "../patreon-iframe/patreon-iframe.tsx";
import styleSheet from "./premium-content-embed.scss.js";
import type { VideoInfo } from "../../types/index.ts";

const ONE_HOUR_MS = 3600 * 1000;

const CLOSE_ICON_PATH =
  "M19,6.41 L17.59,5 L12,10.59 L6.41,5 L5,6.41 L10.59,12 L5,17.59 L6.41,19 L12,13.41 L17.59,19 L19,17.59 L13.41,12 L19,6.41 Z";
const EXPAND_ICON_PATH =
  "M14 21v-2h3.59l-4.5-4.5 1.41-1.41 4.5 4.5V14h2v7h-7M9.5 10.91L5 6.41V10H3V3h7v2H6.41l4.5 4.5-1.41 1.41z";
const PATREON_ICON_PATH =
  "M4.23146 0.421875V23.5172H0V0.421875H4.23146ZM15.3429 0.421875C20.1241 0.421875 24 4.29781 24 9.07902C24 13.8602 20.1241 17.7362 15.3429 17.7362C10.5616 17.7362 6.68571 13.8602 6.68571 9.07902C6.68571 4.29781 10.5616 0.421875 15.3429 0.421875Z";
const PLAY_ICON_PATH = "M8 5V19L19 12L8 5Z";

const VISIBLE_STYLE = {
  width: "100%",
  // height: "484px",
  height: "664px", // TODO: taller for merch ad, can swap back
  display: "block",
  "margin-bottom": "12px",
  background: "transparent",
};

const VISIBLE_PATRON_STYLE = {
  ...VISIBLE_STYLE,
  // height: "516px",
  height: "664px", // TODO: taller for merch ad, can swap back
};

const COLLAPSED_STYLE = {
  ...VISIBLE_STYLE,
  height: "32px",
};

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DATAPOINT_INCREMENT_UNIQUE_MUTATION = gql`
mutation DatapointIncrementUnique ($input: DatapointIncrementUniqueInput!) {
  datapointIncrementUnique(input: $input) { isUpdated }
}`;

const CHANNEL_POST_CONNECTION_QUERY = gql`
query ChannelPostConnection($input: ChannelPostConnectionInput) {
  channelPostConnection(input: $input) {
    nodes {
      data
    }
  }
}`;

const PREVIEW_POST_COUNT = 3;

type Props = {
  patreonUsername: string;
  creatorName: string;
  channelId: string;
};

function Embed(
  { patreonUsername, creatorName, channelId }: Props,
) {
  useStyleSheet(styleSheet);
  useGoogleFontLoader(() => ["Roboto"]);
  const tierName = useSelector(() => tierName$.get());

  const [_incrementUniquePayload, executeDatapointIncrementUniqueMutation] =
    useMutation(
      DATAPOINT_INCREMENT_UNIQUE_MUTATION,
    );

  const [channelPostConnectionResponse] = useQuery({
    query: CHANNEL_POST_CONNECTION_QUERY,
    variables: {
      input: {
        channelId,
      },
    },
  }, {
    skip: !channelId,
  });

  const isCollapsed$ = useSignal(false);
  const isCollapsed = useSelector(() => isCollapsed$.get());
  const isWatching$ = useSignal(false);
  const isWatching = useSelector(() => isWatching$.get());
  const extensionInfo$ = useSignal(jumper.call("context.getInfo"));
  const isPatron = Boolean(tierName);

  useEffect(() => {
    // set styles for this iframe within YouTube's site
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        { action: "useSubject" }, // start with our iframe
        {
          action: "setStyle",
          value: isCollapsed
            ? COLLAPSED_STYLE
            : isPatron
            ? VISIBLE_PATRON_STYLE
            : VISIBLE_STYLE,
        },
      ],
    });
  }, [isCollapsed, isPatron]);

  const loadVideo = ({ e, url, title }) => {
    e?.stopPropagation();
    const tierName = tierName$.get();
    const isPatron = Boolean(tierName);
    const supportsEmbeddedVideo = semver.satisfies(
      extensionInfo$.get().version,
      ">=4.0.1",
    );

    // TODO: set with jumper.call storage.set so it works w/ 3rd party cookies disabled
    setCookie("patreon-click", "true", { ttlMs: ONE_HOUR_MS });
    executeDatapointIncrementUniqueMutation({
      input: {
        metricSlug: "unique-patreon-premium-content-embed-clicks",
        dimensionValues: {
          "patreon-tier-name": tierName || "none",
        },
      },
    });

    if (supportsEmbeddedVideo) {
      e?.preventDefault();
      isWatching$.set(true);
      const videoInfo: VideoInfo = {
        url,
        title,
        isPatron,
      };
      jumper.call("comms.postMessage", {
        type: "patreon.showVideoEmbed",
        body: { videoInfo },
      });
    }
  };

  const merchClick = () => {
    // TODO: set with jumper.call storage.set so it works w/ 3rd party cookies disabled
    setCookie("patreon-click", "true", { ttlMs: ONE_HOUR_MS });

    executeDatapointIncrementUniqueMutation({
      input: {
        metricSlug: "unique-patreon-premium-content-embed-ad-clicks",
      },
    });
  };

  const toggle = (e) => {
    e?.stopPropagation();
    e?.preventDefault();
    isCollapsed$.set(!isCollapsed$.get());
  };

  const channelPosts =
    channelPostConnectionResponse.data?.channelPostConnection?.nodes || [];

  // HACK: hardcode for the yard / wine about it
  const featuredPost =
    channelPosts.find((channelPost) =>
      channelPost.data.title?.includes("Ep.")
    ) || channelPosts[0] || { data: {} };

  const posts = channelPostConnectionResponse.data?.channelPostConnection?.nodes
    ?.filter((channelPost) => channelPost.data.url !== featuredPost.data.url)
    ?.slice(0, PREVIEW_POST_COUNT) || [];

  // HACK: hardcode for the yard
  const newEpisodeTime = new Date(Date.UTC(2023, 3, 6, 18, 0, 0, 0));

  return (
    <div className="c-premium-content-embed">
      <PatreonIframe
        url={`https://www.patreon.com/${patreonUsername}/membership?embed`}
        isHidden={true}
      />
      <div
        className={`patreon-content ${isCollapsed ? "is-collapsed" : ""}`}
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
                {isPatron
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
          <a
            className="featured-post"
            href={featuredPost.data.url}
            target="_blank"
            onClick={(e) => loadVideo({ e, ...featuredPost.data })}
          >
            <div className="preview">
              <div
                className="background"
                style={{
                  backgroundImage: `url(${featuredPost.data.imageUrl})`,
                }}
              >
              </div>
              {!isPatron
                ? (
                  <div className="lock">
                    <LockIcon />
                  </div>
                )
                : null}
              <a
                className="button"
                href={featuredPost.data.url}
                target="_blank"
                onClick={(e) => loadVideo({ e, ...featuredPost.data })}
              >
                <Icon
                  icon={PLAY_ICON_PATH}
                  size="24px"
                  color="#fff"
                />
                {isWatching ? "Currently playing" : "Watch now"}
              </a>
            </div>
            <div className="info">
              <div className="title">
                {featuredPost.data.title}
              </div>
              {/* <div className="description">129 likes · 3 days ago</div> */}
              {patreonUsername === "theyard" && (
                <div className="schedule">
                  New episode every {DAYS_OF_WEEK[newEpisodeTime.getDay()]} at
                  {" "}
                  {newEpisodeTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    timeZoneName: "short",
                  })}
                </div>
              )}
            </div>
          </a>
          {/* TODO: remove and only show divider once merch sale is over */}
          {patreonUsername === "theyard"
            ? (
              <a
                className="merch"
                href="https://theyard.sale/"
                target="_blank"
                onClick={merchClick}
              >
                <div className="background" />
                <div className="title">
                  Get the new Yard merch!
                </div>
              </a>
            )
            : <div className="divider" />}
          <div className="posts">
            <div className="title">More premium content from {creatorName}</div>
            {posts.map(
              (channelPost) => {
                return (
                  <a
                    href={channelPost.data.url}
                    onClick={(e) => loadVideo({ e, ...channelPost.data })}
                    target="_blank"
                    className="post"
                  >
                    <div
                      className="thumbnail"
                      style={{
                        backgroundImage: `url(${channelPost.data.imageUrl})`,
                      }}
                    />
                    <div className="info">{channelPost.data.title}</div>
                  </a>
                );
              },
            )}
          </div>
        </div>
      </div>
      {isPatron && patreonUsername === "theyard" && <DiscordPromo />}
    </div>
  );
}

export default Embed;

function DiscordPromo() {
  return (
    <div className="discord-promo">
      <div className="logos">
        <div className="yard logo">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.0216 0.219856C3.15612 0.341999 3.27535 0.448874 3.28452 0.458035C3.29369 0.467196 3.72171 0.851946 4.24145 1.30998L5.18002 2.14361V2.91311C5.18002 3.3345 5.1892 4.04293 5.20143 4.4857L5.21977 5.28879L5.44601 5.27657C5.5683 5.26741 5.67836 5.25214 5.69059 5.24298C5.69976 5.23077 5.69059 4.55593 5.66919 3.73757C5.63861 2.49171 5.63861 2.24743 5.67224 2.21384C5.6967 2.19246 6.14918 1.78634 6.67808 1.31304C7.20699 0.836679 7.69004 0.403071 7.75118 0.345053L7.8643 0.238177L8.94657 1.18478L10.0288 2.13445L10.0686 3.50245C10.09 4.25363 10.1114 4.8735 10.1144 4.87655C10.1267 4.88877 10.7473 4.83075 10.7626 4.81548C10.7687 4.80938 10.7901 4.26279 10.8054 3.60016C10.836 2.52836 10.8451 2.39095 10.891 2.3482C10.9185 2.32071 11.4321 1.85657 12.0283 1.31304C12.6245 0.7695 13.1503 0.293142 13.1931 0.253446L13.2726 0.18016L13.9391 0.876375C14.309 1.25807 14.7493 1.72221 14.9235 1.90238L15.2415 2.23216L15.2109 3.00166C15.1926 3.42611 15.1712 3.9269 15.162 4.11622L15.1467 4.46127L15.4127 4.43989C15.5625 4.42768 15.7031 4.41547 15.7245 4.41547C15.7765 4.41241 15.801 4.52845 15.8315 4.90098C15.8438 5.03534 15.8713 5.33764 15.8927 5.57277C15.9171 5.80789 15.9263 6.00943 15.9141 6.02164C15.9049 6.03386 15.483 6.07966 14.9785 6.12241C14.4741 6.16516 13.7373 6.22623 13.3429 6.25982C12.9485 6.29341 12.4594 6.33616 12.2576 6.35143C12.0558 6.36975 11.8143 6.38807 11.7226 6.39723C11.5514 6.4125 11.4566 6.42166 9.92795 6.54991C8.53078 6.669 7.32011 6.77282 5.95963 6.88581C5.27174 6.94688 4.4524 7.01406 4.14056 7.03848C3.82871 7.06291 3.34872 7.10566 3.07051 7.13009C2.4774 7.18506 1.26061 7.28582 0.603303 7.33773L0.138599 7.37743L0.120256 7.23697C0.0896835 6.99879 -0.0112064 5.75598 0.0010226 5.74377C0.00713713 5.73766 0.196687 5.71934 0.422925 5.70102L0.835655 5.67048L0.817312 3.93606L0.798968 2.20468L0.872342 2.11307C0.912087 2.06421 1.28202 1.64282 1.69475 1.17562C2.10748 0.708428 2.50492 0.253445 2.58135 0.164891C2.65778 0.0732841 2.73116 0 2.74644 0C2.75867 0 2.88402 0.100767 3.0216 0.219856ZM13.936 7.14841L15.0397 7.45988L15.0336 7.66141C15.0275 7.77134 15.0122 8.30266 14.9938 8.84009C14.9755 9.37752 14.948 10.1592 14.9327 10.5776C14.9143 10.9959 14.9052 11.341 14.9113 11.3471C14.9143 11.3532 15.1589 11.3837 15.4494 11.4173C15.7398 11.4509 15.9874 11.4845 15.9966 11.4936C16.0119 11.512 15.9752 11.9334 15.8896 12.6632C15.8468 13.054 15.8346 13.0998 15.7826 13.0998C15.7337 13.0998 12.4532 12.7395 12.0436 12.6876C11.9763 12.6815 10.304 12.4952 8.329 12.2754C6.35401 12.0586 4.48297 11.8509 4.17113 11.8143C3.85929 11.7807 3.43433 11.7318 3.22338 11.7105C1.84761 11.5608 0.312864 11.3898 0.199745 11.3715L0.0652252 11.3532L0.086626 11.1852C0.0988551 11.0906 0.132485 10.7516 0.166115 10.431C0.199745 10.1104 0.233374 9.82029 0.242546 9.78365C0.254775 9.72563 0.263948 9.72258 0.566617 9.75617L0.8754 9.78975L0.866228 8.91338C0.860113 8.42786 0.863171 8.02479 0.8754 8.01563C0.884571 8.00647 1.24839 7.98509 1.68252 7.96982C2.11971 7.95456 2.68224 7.93318 2.93294 7.92402C3.85317 7.89043 5.04551 7.84768 5.12499 7.84768H5.2106L5.21671 9.05995L5.22588 10.2722L5.53161 10.3119C5.6967 10.3333 5.84039 10.3455 5.84345 10.3394C5.84957 10.3333 5.84039 9.81113 5.82205 9.17599C5.80371 8.54084 5.79759 8.01257 5.81288 8.00036C5.85568 7.96066 9.7384 7.10872 9.95241 7.09345L10.1572 7.07513L10.1756 7.42323C10.197 7.89959 10.2551 10.0493 10.2551 10.4432C10.2551 10.6203 10.2673 10.7791 10.2795 10.8005C10.2918 10.8188 10.3713 10.8463 10.4569 10.8555L10.6158 10.8768L10.6342 10.3638C10.6434 10.0798 10.6678 9.21263 10.6892 8.44007L10.7228 7.02932L10.8788 7.011C10.9644 7.00184 11.3098 6.97131 11.6461 6.94382C11.9824 6.91634 12.3615 6.88275 12.4869 6.87054C12.6122 6.85832 12.7406 6.84611 12.7743 6.84306C12.8048 6.84306 13.3276 6.98047 13.936 7.14841ZM4.83455 12.4311L5.20448 12.4647L5.21671 14.2266C5.22283 15.1946 5.22283 15.9916 5.21977 15.9977C5.20754 16.0129 0.961003 15.9488 0.945717 15.9335C0.939602 15.9274 0.924316 15.1946 0.912087 14.3029L0.890686 12.6815L1.11692 12.6601C1.24227 12.651 1.69475 12.6143 2.12276 12.5807C2.55078 12.5471 3.01243 12.5105 3.14695 12.5013C3.28146 12.4891 3.59025 12.4647 3.83177 12.4464C4.0733 12.428 4.31482 12.4097 4.36679 12.4036C4.41877 12.3975 4.62972 12.4097 4.83455 12.4311ZM10.3132 13.051C10.3346 13.0662 10.3468 13.2036 10.3468 13.4296C10.3468 13.625 10.3621 14.1777 10.3774 14.6541C10.3957 15.1305 10.3988 15.5305 10.3865 15.5427C10.3743 15.5518 10.1083 15.5518 9.79649 15.5396C9.023 15.5091 8.44518 15.4908 7.13667 15.448C6.52216 15.4297 6.01466 15.4083 6.00549 15.3992C5.98714 15.3839 5.93211 13.1029 5.9474 13.0876C5.95351 13.0785 6.84012 13.0662 7.91627 13.054C8.99243 13.0418 9.87904 13.0235 9.88821 13.0174C9.90961 12.996 10.2704 13.0265 10.3132 13.051ZM14.257 13.4754L14.8226 13.5426L14.8165 13.7258C14.7798 14.8251 14.7431 15.6526 14.7248 15.6679C14.7126 15.6801 14.5444 15.6954 14.3518 15.7076C14.1592 15.7167 13.2787 15.7748 12.3952 15.8328C11.5116 15.8908 10.729 15.9427 10.6525 15.9458L10.5149 15.9549L10.5058 15.7564C10.4935 15.4877 10.5455 13.9304 10.5669 13.909C10.5761 13.8999 11.16 13.7777 11.8632 13.6342C13.3185 13.3441 13.2023 13.3502 14.257 13.4754Z"
              fill="white"
            />
          </svg>
        </div>
        <div className="divider" />
        <div className="truffle logo">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M1.34944 7.12045C1.66596 7.31144 1.98975 7.45778 2.29003 7.53118C2.60482 7.60813 2.97415 7.62333 3.26138 7.41752C3.66056 7.13148 3.83525 6.7948 3.89559 6.43081C3.92378 6.26076 3.92602 6.09172 3.92301 5.93658C3.92171 5.86997 3.91961 5.80856 3.91758 5.74916L3.91758 5.74908L3.91757 5.74876C3.91451 5.65947 3.91162 5.5747 3.91162 5.48063C3.91162 5.28335 3.75213 5.12297 3.55484 5.12297C3.35754 5.12297 3.19805 5.28335 3.19805 5.48063C3.19805 5.58322 3.20165 5.69162 3.20491 5.78979V5.7898L3.20493 5.79044C3.20685 5.84827 3.20864 5.90237 3.20958 5.9505C3.21233 6.09259 3.20897 6.20928 3.19168 6.31354C3.16107 6.49816 3.08532 6.66441 2.84642 6.83559C2.81441 6.85853 2.70499 6.89634 2.45907 6.83623C2.22759 6.77965 1.94184 6.65097 1.638 6.45846C1.02799 6.07196 0.416436 5.4742 0.0873642 4.85521L0.0879163 4.85615L0.0876897 4.85501C0.0858004 4.84714 0.0739519 4.79783 0.0995572 4.6765C0.127805 4.54265 0.191705 4.36892 0.292821 4.16216C0.494139 3.75051 0.816775 3.26063 1.18792 2.78685C1.55842 2.31391 1.96629 1.871 2.33058 1.55021C2.51318 1.38942 2.67745 1.26587 2.81474 1.18456C2.96261 1.09699 3.03794 1.08337 3.0539 1.08337C3.10605 1.08337 3.1912 1.11057 3.31121 1.2284C3.42976 1.34481 3.54927 1.51846 3.6623 1.72937C3.88753 2.14968 4.0496 2.64654 4.12128 2.91981C4.17135 3.11068 4.36639 3.22509 4.5572 3.17471C4.74791 3.12437 4.86143 2.92867 4.81139 2.73789C4.78794 2.6485 4.75601 2.53786 4.71604 2.41387C5.68838 1.87205 6.8084 1.56334 8.00053 1.56334C9.21258 1.56334 10.3501 1.88246 11.3337 2.44125C11.2698 2.62563 11.2211 2.79026 11.1886 2.91409C11.1385 3.10487 11.252 3.30057 11.4428 3.35091C11.6336 3.40129 11.8286 3.28688 11.8787 3.09601C11.9504 2.82274 12.1124 2.32588 12.3377 1.90557C12.4507 1.69466 12.5702 1.52101 12.6887 1.4046C12.8088 1.28677 12.8939 1.25957 12.9461 1.25957C12.962 1.25957 13.0373 1.27319 13.1852 1.36076C13.3225 1.44207 13.4868 1.56563 13.6694 1.72641C14.0337 2.0472 14.4415 2.49011 14.812 2.96306C15.1832 3.43683 15.5058 3.92671 15.7071 4.33836C15.8082 4.54512 15.8721 4.71886 15.9004 4.8527C15.926 4.97403 15.9142 5.02335 15.9123 5.03121L15.912 5.03235L15.9126 5.03141C15.5835 5.6504 14.972 6.24816 14.362 6.63467C14.0581 6.82717 13.7724 6.95585 13.5409 7.01243C13.295 7.07254 13.1855 7.03473 13.1535 7.01179C12.9146 6.84061 12.8389 6.67436 12.8083 6.48974C12.791 6.38548 12.7876 6.26879 12.7904 6.1267C12.7913 6.07857 12.7931 6.02447 12.795 5.96664L12.795 5.966C12.7983 5.86782 12.8019 5.75942 12.8019 5.65683C12.8019 5.45955 12.6424 5.29917 12.4451 5.29917C12.2478 5.29917 12.0883 5.45955 12.0883 5.65683C12.0883 5.7509 12.0854 5.83567 12.0824 5.92496L12.0824 5.92529C12.0803 5.98471 12.0782 6.04614 12.0769 6.11279C12.0739 6.26793 12.0762 6.43697 12.1044 6.60701C12.1647 6.971 12.3394 7.30768 12.7386 7.59372C13.0258 7.79953 13.3951 7.78433 13.7099 7.70738C14.019 7.63184 14.3529 7.47904 14.6782 7.27982C14.7307 7.6191 14.7579 7.96672 14.7579 8.3207C14.7579 12.0527 11.7325 15.0781 8.00053 15.0781C4.26854 15.0781 1.24317 12.0527 1.24317 8.3207C1.24317 7.91108 1.27962 7.50997 1.34944 7.12045Z"
              fill="#F357A1"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.6724 11.3582C11.6724 12.5 10.0185 12.5 7.97836 12.5C5.93821 12.5 4.28433 12.5 4.28433 11.3582C4.28433 9.50352 5.93821 8 7.97836 8C10.0185 8 11.6724 9.50352 11.6724 11.3582ZM7.48989 10.5158C7.48989 11.1144 7.09283 11.5997 6.60303 11.5997C6.11323 11.5997 5.71617 11.1144 5.71617 10.5158C5.71617 9.91712 6.11323 9.43182 6.60303 9.43182C7.09283 9.43182 7.48989 9.91712 7.48989 10.5158ZM9.26208 11.5997C9.75187 11.5997 10.1489 11.1144 10.1489 10.5158C10.1489 9.91712 9.75187 9.43182 9.26208 9.43182C8.77228 9.43182 8.37522 9.91712 8.37522 10.5158C8.37522 11.1144 8.77228 11.5997 9.26208 11.5997Z"
              fill="white"
              fill-opacity="0.7"
            />
          </svg>
        </div>
      </div>
      Help us improve Patreon with Truffle.
      <a href="https://discord.gg/TGNbHVddy7" target="_blank">Let's chat</a>
    </div>
  );
}

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
