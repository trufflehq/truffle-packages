// import './styles/App.scss'
// import './styles/AppSlim.scss'
// import './styles/Slider.scss'
// import ExpandAlt from './images/expand-alt.svg'
// import Shrink from './images/down-left-and-up-right-to-center-solid.svg'
import React from "https://npm.tfl.dev/react";
import Draggable from "../draggable/draggable.tsx";
import SongInfo from "../song-info/song-info.tsx";
import ToolTip from "../tooltip/tooltip.tsx";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.5/format/wc/react/index.ts";
import styleSheet from "./spotify-component.scss.js";
import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";
import { useEffect, useState } from "https://npm.tfl.dev/react";

import { Dimensions, Modifiers, Vector } from "../draggable/draggable.tsx";

interface Image {
  height: number;
  width: number;
  url: string;
}

export interface Artist {
  external_urls: { spotify: string };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface SpotifyData {
  title: string;
  link: string;
  fetchTime: number;
  artists: Artist[];
  is_playing: boolean;
  position: number; //milliseconds
  length: number; //milliseconds
  images: Image[];
}

function SpotifyComponent() {
  useStyleSheet(styleSheet);
  //set base dimensions & modifiers
  const defaultModifier: Modifiers = {
    top: -43,
    right: 0,
    bottom: 0,
    left: 10,
    transition: "none",
  };
  const base: Vector = { x: 415, y: 150 };
  const startingDimensions: Dimensions = {
    base: base,
    modifiers: defaultModifier,
  };
  const startPosition: Vector = { x: 0, y: 0 };
  const [dragProps, setDragProps] = useState(
    {
      dimensions: startingDimensions,
      defaultPosition: startPosition,
    },
  );
  const [spotifyData, setSpotifyData] = useState<SpotifyData>();
  const [toolTip, setToolTip] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [trackPosition, setTrackPosition] = useState<number>(0);
  //pull data from cloudflare worker
  const fetchRefreshMs = 10000;
  const workerUrl = "https://spotify-song-info.deno.dev/spotify/song/info";
  const context = globalContext.getStore();
  const orgId = context.orgId;

  useEffect(() => {
    const overlayStates: Record<any, Modifiers> = {
      fullSize: { ...defaultModifier },
      collapsed: {
        ...defaultModifier,
        top: -98,
        right: -200,
        transition: `clip-path 0.5s ease`,
      },
      toolTip: { ...defaultModifier, top: 0 },
    };
    let modifiers = overlayStates.fullSize;
    if (toolTip) modifiers = overlayStates.toolTip;
    if (collapsed) modifiers = overlayStates.collapsed;
    setDragProps((old) => ({
      ...old,
      dimensions: { ...old.dimensions, modifiers: modifiers },
    }));
  }, [collapsed, toolTip]);

  useEffect(() => {
    async function fetchData() {
      const jsonResponse = await (await fetch(`${workerUrl}?orgId=${orgId}`))
        .json();
      //store fetch time to calculate song position
      jsonResponse.fetchTime = Date.now();
      setSpotifyData(jsonResponse);
    }
    fetchData(); //fetch on page load
    //TODO: queue a fetch to go off at the end of every song
    // (needs to be done in backend as well as frontend)
    //fetch at the specified refresh rate
    const fetchInterval = setInterval(
      () => (fetchData().catch(console.error)),
      fetchRefreshMs,
    );
    return () => (clearInterval(fetchInterval));
  }, []);

  //update the progress bar based on system time
  const progressBarRefreshMs = 1000;
  useEffect(() => {
    const progressUpdateInterval = setInterval(() => {
      if (!spotifyData) return;
      if (spotifyData.is_playing) {
        setTrackPosition(
          spotifyData.position + (Date.now() - spotifyData.fetchTime),
        );
      } else {
        setTrackPosition(spotifyData.position);
      }
    }, progressBarRefreshMs);
    return () => (clearInterval(progressUpdateInterval));
  }, [spotifyData]);

  if (!spotifyData) return <div>loading</div>;
  const progressDate = new Date(Math.min(trackPosition, spotifyData.length));
  const percentDone = trackPosition / spotifyData.length;
  const collapsedTag = collapsed ? " collapsed" : "";
  return (
    <aside style={{ background: "none" }}>
      <style>{`html { overflow: hidden }`}</style>
      <Draggable
        dimensions={dragProps.dimensions}
        defaultPosition={dragProps.defaultPosition}
      >
        <div
          className={"spotify-component" + collapsedTag}
          //only expand on click if the window is already collapsed
          onClick={() => collapsed && setCollapsed((oldState) => !oldState)}
        >
          <img
            className="album-art"
            src={spotifyData.images[0].url}
            alt="album cover"
          />
          <SongInfo
            spotifyData={spotifyData}
            percentDone={percentDone}
            progressDate={progressDate}
          />
          <div className="controls">
            <ToolTip
              className="help tooltip"
              setHoverState={setToolTip}
              hoverText="what the streamer is currently listening to"
            >
              ?
            </ToolTip>
            <ToolTip
              className="minimize tooltip"
              setHoverState={setToolTip}
              hoverText="shrink the spotify overlay"
              onClick={() => setCollapsed((oldState: boolean) => !oldState)}
            >
              ‒
            </ToolTip>
          </div>
        </div>
      </Draggable>
    </aside>
  );
}

export default SpotifyComponent;
