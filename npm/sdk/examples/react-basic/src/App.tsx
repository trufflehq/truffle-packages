import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { getEmbed, PageInfo } from "@trufflehq/sdk";

const embed = getEmbed();

function App() {
  const [count, setCount] = useState(0);

  const [isSmall, setIsSmall] = useState(true);
  const [hasBorder, setHasBorder] = useState(false);

  const [pageInfo, setPageInfo] = useState<PageInfo | {}>({});
  useEffect(() => {
    embed.getPageInfo().then((info) => {
      setPageInfo(info);
    });
  }, []);

  const setSize = () => {
    if (isSmall) {
      embed.setSize("800px", "800px");
      setIsSmall(false);
    } else {
      embed.setSize("600px", "600px");
      setIsSmall(true);
    }
  };

  const setBorder = () => {
    if (hasBorder) {
      embed.setStyles({
        border: "none",
      });
      setHasBorder(false);
    } else {
      embed.setStyles({
        border: "5px solid red",
      });
      setHasBorder(true);
    }
  };

  const setContainer = () => {
    embed.setContainer("#title.ytd-watch-metadata", "prepend");
  };

  const hideWindow = () => {
    embed.setWindowVisibility(false);
  };

  const showToast = () => {
    embed.showToast({
      title: "Hello World!",
      body: "A message from Truffle",
      onClick: () => {
        embed.openWindow();
      },
    });
  };

  return (
    <div className="App">
      <div>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://truffle.vip" target="_blank">
          <img
            src="https://cdn.bio/assets/images/branding/logomark.svg"
            className="logo truffle"
            alt="Truffle logo"
          />
        </a>
      </div>
      <h1>React + Truffle</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <h2>Embed controls</h2>
      <button onClick={setSize}>Toggle Size</button>
      <button onClick={setBorder}>Toggle Border</button>
      <button onClick={setContainer}>Set Container</button>
      <button onClick={hideWindow}>Hide Window</button>
      <button onClick={showToast}>Show Toast</button>

      <h2>Page Info</h2>
      <pre
        style={{ textAlign: "left" }}
      >
        {JSON.stringify(pageInfo, null, 2)}
      </pre>
    </div>
  );
}

export default App;
