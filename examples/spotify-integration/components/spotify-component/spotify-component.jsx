// import './styles/App.scss'
// import './styles/AppSlim.scss'
// import './styles/Slider.scss'
// import ExpandAlt from './images/expand-alt.svg'
// import Shrink from './images/down-left-and-up-right-to-center-solid.svg'
import React from 'https://npm.tfl.dev/react'
import Draggable from '../draggable/draggable.jsx'
import SongInfo from '../song-info/song-info.jsx'
import ToolTip from '../tooltip/tooltip.jsx'
import ScopedStylesheet from "https://tfl.dev/@truffle/ui@0.0.1/components/scoped-stylesheet/scoped-stylesheet.js"
import Stylesheet from "https://tfl.dev/@truffle/ui@0.0.1/components/stylesheet/stylesheet.js"
import jumper from "https://tfl.dev/@truffle/utils@0.0.1/jumper/jumper.js"
import { useEffect, useState } from 'https://npm.tfl.dev/react'

function SpotifyComponent() {
  //set base dimensions
  const defaultModifier = { top: -43, right: 0, bottom: 0, left: 10, transition: "none" }
  const base = { x: 415, y: 150 }
  const [dragProps, setDragProps] = useState(
    {
      dimensions: {
        base: base,
        modifiers: defaultModifier
      },
      defaultPosition: { x: 0, y: 0 }
    })
  const [spotifyData, setSpotifyData] = useState()
  const [toolTip, setToolTip] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [trackPosition, setTrackPosition] = useState(0)
  //pull data from cloudflare worker
  const fetchRefreshMs = 10000
  const workerUrl = 'https://spotify-status-updater.shanecranor.workers.dev/'
  const orgID = 'shane'

  useEffect(() => {
    const overlayStates = {
      fullSize: { ...defaultModifier },
      collapsed: { ...defaultModifier, top: -98, right: -200, transition: `clip-path 0.5s ease` },
      toolTip: { ...defaultModifier, top: 0 }
    }
    let modifiers = overlayStates.fullSize
    if (toolTip) modifiers = overlayStates.toolTip
    if (collapsed) modifiers = overlayStates.collapsed
    setDragProps((old) => ({
      ...old, dimensions: { ...old.dimensions, modifiers: modifiers }
    }))
  }, [collapsed, toolTip])

  useEffect(() => {
    async function fetchData() {
      const jsonResponse = await (await fetch(`${workerUrl}?orgID=${orgID}`)).json()
      //store fetch time to calculate song position
      jsonResponse.fetchTime = Date.now()
      setSpotifyData(jsonResponse)
    }
    fetchData() //fetch on page load
    //TODO: queue a fetch to go off at the end of every song
    //fetch at the specified refresh rate
    const fetchInterval = setInterval(
      () => (fetchData().catch(console.error)),
      fetchRefreshMs
    )
    return () => (clearInterval(fetchInterval))
  }, [])

  //update the progress bar based on system time
  const progressBarRefreshMs = 1000
  useEffect(() => {
    const progressUpdateInterval = setInterval(() => {
      if (!spotifyData) return
      if (spotifyData.is_playing) {
        setTrackPosition(spotifyData.position + (Date.now() - spotifyData.fetchTime))
      } else {
        setTrackPosition(spotifyData.position)
      }
    }, progressBarRefreshMs)
    return () => (clearInterval(progressUpdateInterval))
  }, [spotifyData])

  if (!spotifyData) return <div>loading</div>
  const progressDate = new Date(Math.min(trackPosition, spotifyData.length))
  const percentDone = trackPosition / spotifyData.length
  const collapsedTag = collapsed ? ' collapsed' : ''
  return (
    <aside style={{ background: "none" }}>
      <style>{`html { overflow: hidden }`}</style>
      <Draggable
        dimensions={dragProps.dimensions}
        defaultPosition={dragProps.defaultPosition}>
        <Stylesheet url={new URL("styles/App.css", import.meta.url)} />
        <div className={'spotify-component' + collapsedTag}
          onClick={() => collapsed && setCollapsed(oldState => !oldState)}
        >
          <img
            className={'album-art ' + collapsedTag}
            src={spotifyData.images[0].url} alt='album cover'
          />
          <SongInfo
            spotifyData={spotifyData}
            percentDone={percentDone}
            progressDate={progressDate}
          />
          <div className='controls' >
            <ToolTip className='help tooltip'
              setHoverState={setToolTip}
              hoverText='what the streamer is currently listening to'>
              ?
            </ToolTip>
            <ToolTip className='minimize tooltip'
              setHoverState={setToolTip}
              hoverText='shrink the spotify overlay'
              onClick={() => setCollapsed(oldState => !oldState)}>
              ‒
            </ToolTip>
          </div>
        </div>
      </Draggable>
    </aside>
  )
}

export default SpotifyComponent
