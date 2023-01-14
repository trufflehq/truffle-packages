import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { embed } from '@trufflehq/sdk'
import Draggable from './Draggable'
import { Dimensions, Modifiers, Vector } from "./Draggable.tsx";
function App() {
  const defaultModifier: Modifiers = {
    top: 0, right: 0, bottom: 0, left: 0,
    transition: "none",
  };
  const base: Vector = { x: 800, y: 800 };
  const startingDimensions: Dimensions = {
    base: base,
    modifiers: defaultModifier,
  };
  const startPosition: Vector = { x: 100, y: 100 };
  const [dragProps, setDragProps] = useState(
    {
      dimensions: startingDimensions,
      defaultPosition: startPosition,
    },
  );
  const [count, setCount] = useState(0)

  const [isSmall, setIsSmall] = useState(true)
  const [hasBorder, setHasBorder] = useState(false)
  const setSize = () => {
    if (isSmall) {
      // Do not use embed.setSize with the draggable component.
      // The draggable component creates a fullscreen iframe
      // The size is determined by a clip path
      // embed.setSize("800px", "800px")
      setIsSmall(false)
    } else {
      // embed.setSize("600px", "600px")
      setIsSmall(true)
    }
  }
  
  const setBorder = () => {
    if (hasBorder) {
      // embed.setStyles({
      //   border: "none"
      // })
      setHasBorder(false)
    } else {
      // embed.setStyles({
      //   border: "5px solid red"
      // })
      setHasBorder(true)
    }
  }
  const appStyles = {
    width: isSmall ? 800 : 600, 
    height: isSmall ? 800 : 600,
    border: hasBorder ? "5px solid red" : "none"
  }
  return (
    <Draggable
    dimensions={dragProps.dimensions}
    defaultPosition={dragProps.defaultPosition}
    ignoreClassName="no-drag"
    >
      <div className="App" style={appStyles}>
        <div>
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo react no-drag" alt="React logo" />
          </a>
          <a href="https://truffle.vip" target="_blank">
            <img src="https://cdn.bio/assets/images/branding/logomark.svg" className="logo truffle no-drag" alt="Truffle logo" />
          </a>
        </div>
        <h1>React + Truffle</h1>
        <div className="card">
          <button className="no-drag" onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <h2>Embed controls</h2>
        <button className="no-drag"  onClick={setSize}>Toggle Size</button>
        <button className="no-drag"  onClick={setBorder}>Toggle Border</button>
      </div>
    </Draggable>
  )
}

export default App
