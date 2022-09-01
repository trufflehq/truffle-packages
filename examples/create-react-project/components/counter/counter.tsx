import React, { useState } from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.5/format/wc/react/index.ts";
import Button from "https://tfl.dev/@truffle/ui@~0.1.0/components/button/button.tag.ts";

import styleSheet from "./counter.scss.js";

export default function Counter({ initialCount = 0 }) {
  useStyleSheet(styleSheet);

  const [count, setCount] = useState(initialCount);

  return (
    <div className="c-counter">
      <div className="count">Count: {count}</div>
      <Button className="button" onClick={() => setCount(count + 1)}>
        Increment
      </Button>
    </div>
  );
}

Counter.propTypes = {
  someProp: PropTypes.number,
};
