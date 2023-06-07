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

const YOUTUBE_EXPANDED_LANDSCAPE_MENU_WIDTH = "min(43%, 350px)";

export const YOUTUBE_EXPANDED_LANDSCAPE_MENU_STYLES = {
  ...BASE_MENU_STYLES,
  width: YOUTUBE_EXPANDED_LANDSCAPE_MENU_WIDTH,
  position: "fixed",
  right: "0",
  left: "unset",
};

export const YOUTUBE_PORTRAIT_STYLESHEET = `
.truffle-portrait-open {
  overflow: hidden; /* no scrolling on body when portrait is open */
}

.truffle-portrait ytm-mobile-topbar-renderer .mobile-topbar-header-content .topbar-menu-button-avatar-button {
  display: none !important; /* hide search icon */
}`;

export const YOUTUBE_LANDSCAPE_STYLESHEET = `
.truffle-landscape ytm-app {
  display: none !important; /* get rid of any yt ui other than the video container */
}

.truffle-landscape .player-container {
  top: 0 !important; /* move above youtube header */
  bottom: 0 !important; /* full height */
  right: 0 !important; /* on tablet landscape, yt tries to put stuff here */
}

.truffle-landscape-open .player-container {
  right: ${YOUTUBE_EXPANDED_LANDSCAPE_MENU_WIDTH} !important; /* space for our menu */
}

.truffle-landscape #player {
  /* override the padding-bottom aspect ratio yt uses */
  height: 100%;
  max-height: -webkit-fill-available;
  padding-bottom: 0;
}

.html5-video-container {
  /* yt doesn't have this fill width/height since they rely on js-generated px sizes for <video> */
  /* js-generated doesn't work for us since we add the menu after those sizes are set */
  width: 100%;
  height: 100%;
  display: flex; /* vertically center */
  align-items: center;
}

.video-stream {
  /* yt uses static js-generated px sizes here. we override those with something more flexible */
  width: 100% !important;
  height: auto !important;
  left: 0 !important;
  top: 0 !important;
  max-height: 100% !important;
  object-fit: contain !important;

  position: static !important; /* prev absolute. need static to center */
}
`;

export const YOUTUBE_MENU_ORIENTATION_STYLESHEET = `
  ${YOUTUBE_PORTRAIT_STYLESHEET}
  ${YOUTUBE_LANDSCAPE_STYLESHEET}
`;
