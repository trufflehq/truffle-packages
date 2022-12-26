const YOUTUBE_HEADER_HEIGHT_PX = 48;

export const BASE_MENU_STYLES = {
  width: "100%",
  height: "100%",
  background: "none",
  border: "none",
  position: "absolute",
  top: "0",
  left: "0",
  "z-index": "4", // below video settings (clicking on ... top right of yt), but above most other things
  "clip-path": "inset(0 0 0 0)",
};

export const YOUTUBE_COLLAPSED_PORTRAIT_MENU_STYLES = {
  ...BASE_MENU_STYLES,
  position: "fixed",
  "clip-path": "inset(calc(100% - 52px) 36% 12px 36% round 40px)",
};

export const YOUTUBE_COLLAPSED_LANDSCAPE_MENU_STYLES = {
  ...BASE_MENU_STYLES,
  width: "5%",
  position: "fixed",
  right: "0",
  left: "unset",
  "clip-path": "inset(60px 0px calc(100% - 116px) 0px round 4px)",
};

export const YOUTUBE_EXPANDED_PORTRAIT_MENU_STYLES = {
  ...BASE_MENU_STYLES,
  height: `calc(100vh - 56.25vw - ${YOUTUBE_HEADER_HEIGHT_PX}px + 1px)`, // add 1px to be safe if there's any rounding going on
  position: "fixed",
  top: "auto",
  bottom: "0",
  // i can't find where, but somewhere "margin-top: 4px" gets added. this prevents
  "margin-top": "0",
};

export const YOUTUBE_EXPANDED_LANDSCAPE_MENU_STYLES = {
  ...BASE_MENU_STYLES,
  width: "43%",
  position: "fixed",
  right: "0",
  left: "unset",
};

export const YOUTUBE_PORTRAIT_STYLESHEET = `
.truffle-portrait .player-container .video-stream  {
  top: 0 !important;
  height: 100% !important;
  width: 100% !important;
  bottom: 0 !important;
}

.truffle-portrait ytm-mobile-topbar-renderer .mobile-topbar-header-content .topbar-menu-button-avatar-button {
  display: none !important;
}

.truffle-portrait ytm-promoted-sparkles-web-renderer {
  display: none !important;
}

.truffle-portrait .html5-video-container {
  height: 100% !important;
  width: 100% !important;
}

.truffle-portrait-closed ytm-app {
  height: 100vh;
}

.truffle-portrait-closed ytm-app .page-container {
  height: 100%;
}

.truffle-portrait-closed ytm-watch {
  display: flex;
  flex-direction: column;
  height: calc(100% - ${YOUTUBE_HEADER_HEIGHT_PX}px); // 48px is the height of the banner
  overflow: hidden;
}


.truffle-portrait-closed ytm-player-microformat-renderer {
  display: none; // hide the ad banner
}


.truffle-portrait-closed ytm-single-column-watch-next-results-renderer {
  flex: 1;
}
`;

export const YOUTUBE_LANDSCAPE_RIGHT_COLUMN_STYLESHEET = `
.truffle-landscape-open ytm-app {
  height: 100vh;
  max-height: -webkit-fill-available;
  overflow: auto;
}

.truffle-landscape ytm-promoted-sparkles-web-renderer {
  display: none !important;
}

.truffle-landscape ytm-app ytm-mobile-topbar-renderer {
  display: none;
}

.truffle-landscape #player-thumbnail-overlay {
  display: none;
}

.truffle-landscape ytm-app ytm-watch {
  display: flex !important;
}

.truffle-landscape-open ytm-app .related-chips-slot-wrapper {
  display: none;
}

.truffle-landscape-open ytm-app ytm-item-section-renderer {
  border-bottom: none;
}

.truffle-landscape-open ytm-app ytm-single-column-watch-next-results-renderer {
  max-width: 43%;
}

.truffle-landscape-collapsed ytm-app ytm-single-column-watch-next-results-renderer {
  max-width: 5%;
  position: absolute;
  right: 0;
}
`;

export const YOUTUBE_LANDSCAPE_VIDEO_PLAYER_STYLESHEET = `
.truffle-landscape .player-container {
  top: 0 !important;
  bottom: 0 !important;
}

/* sets the video player width */
.truffle-landscape .player-container #player {
  height: 100vh;
  max-height: -webkit-fill-available;
  overflow: hidden !important;
  bottom: 0;
  padding-bottom: 0 !important;
}

.truffle-landscape-open .player-container #player {
  max-width: 57% !important;
}

.truffle-landscape-collapsed .player-container #player {
  max-width: 100% !important;
}

.truffle-landscape-open .html5-video-player {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* wrapper around the video player */
.truffle-landscape-open .html5-video-container {
  height: 0px;
  width: 100% !important;
  padding-top: 56.25%; /* 16:9 aspect ratio */
}

.truffle-landscape-collapsed .html5-video-container {
  height: 0px;
  width: 100% !important;
  padding-top: 56.25%; /* 16:9 aspect ratio */
}


/* video el styles */
.truffle-landscape-open .player-container .video-stream {
  left: 0 !important;
  top: 0px !important;
  width: 100% !important;
  height: 100% !important;
}

.truffle-landscape-collapsed .player-container .video-stream {
  left: 0 !important;
  top: 0px !important;
  width: 100% !important;
  height: 100% !important;
}

/* control overlay */
.truffle-landscape-open #player-control-overlay {
  max-width: 57% !important;
  height: 85% !important;
  height: 100% !important;
}

`;

export const YOUTUBE_LANDSCAPE_STYLESHEET = `
/* landscape styles */
.truffle-landscape ytm-app {
  padding-top: 0 !important;
}

/* video player styles */
${YOUTUBE_LANDSCAPE_VIDEO_PLAYER_STYLESHEET}

/* right side styles */
${YOUTUBE_LANDSCAPE_RIGHT_COLUMN_STYLESHEET}
`;

export const YOUTUBE_MENU_ORIENTATION_STYLESHEET = `
  ${YOUTUBE_PORTRAIT_STYLESHEET}
  ${YOUTUBE_LANDSCAPE_STYLESHEET}
`;
