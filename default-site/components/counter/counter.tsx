import React, { useState } from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15";
import ScopedStylesheet from "https://tfl.dev/@truffle/ui@0.0.1/components/scoped-stylesheet/scoped-stylesheet.jsx";

export default function Counter({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);

  return (
    <ScopedStylesheet url={new URL("./counter.css", import.meta.url)}>
      <div className="count">Count: {count}</div>
      <button className="button" onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </ScopedStylesheet>
  );
}

Counter.propTypes = {
  someProp: PropTypes.number,
};
