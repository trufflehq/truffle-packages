import React, { useState } from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15";
import Stylesheet from "https://tfl.dev/@truffle/ui@0.0.2/components/stylesheet/stylesheet.js";
import Button from "https://tfl.dev/@truffle/ui@0.0.2/components/button/button.entry.js"

export default function Counter({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);

  return (
    <>
      <Stylesheet url={new URL("./counter.css", import.meta.url)} />
      <div className="count">Count: {count}</div>
      <Button className="button" onClick={() => setCount(count + 1)}>
        Increment
      </Button>
    </>
  );
}

Counter.propTypes = {
  someProp: PropTypes.number,
};
