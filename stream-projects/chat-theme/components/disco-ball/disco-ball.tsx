import { React, useEffect, useRef, useStyleSheet } from "../../deps.ts";
import stylesheet from "./disco-ball.scss.js";
function randomColor(type) {
  let c;
  if (type == "bright") {
    c = randomNumber(130, 255);
  } else {
    c = randomNumber(110, 190);
  }

  return `rgb(${c},${c},${c})`;
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// https://codepen.io/msaetre/pen/eYwqrb
export default function DiscoBall() {
  useStyleSheet(stylesheet);
  const discoBallRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let t = 1;
    const radius = 50;
    const squareSize = 6.5;
    const prec = 19.55;
    const fuzzy = 0.001;
    const inc = (Math.PI - fuzzy) / prec;

    for (let t = fuzzy; t < Math.PI; t += inc) {
      const z = radius * Math.cos(t);
      const currentRadius = Math.abs(
        (radius * Math.cos(0) * Math.sin(t)) -
          (radius * Math.cos(Math.PI) * Math.sin(t)),
      ) / 2.5;
      const circumference = Math.abs(2 * Math.PI * currentRadius);
      const squaresThatFit = Math.floor(circumference / squareSize);
      const angleInc = (Math.PI * 2 - fuzzy) / squaresThatFit;
      for (let i = angleInc / 2 + fuzzy; i < (Math.PI * 2); i += angleInc) {
        const square = document.createElement("div");
        const squareTile = document.createElement("div");
        squareTile.style.width = squareSize + "px";
        squareTile.style.height = squareSize + "px";
        squareTile.style.transformOrigin = "0 0 0";
        squareTile.style.webkitTransformOrigin = "0 0 0";
        squareTile.style.webkitTransform = "rotate(" + i + "rad) rotateY(" + t +
          "rad)";
        squareTile.style.transform = "rotate(" + i + "rad) rotateY(" + t +
          "rad)";
        if ((t > 1.3 && t < 1.9) || (t < -1.3 && t > -1.9)) {
          squareTile.style.backgroundColor = randomColor("bright");
        } else {
          squareTile.style.backgroundColor = randomColor("any");
        }
        square?.appendChild(squareTile);
        square.className = "square";
        squareTile.style.webkitAnimation = "reflect 2s linear infinite";
        squareTile.style.webkitAnimationDelay =
          String(randomNumber(0, 20) / 10) +
          "s";
        squareTile.style.animation = "reflect 2s linear infinite";
        squareTile.style.animationDelay = String(randomNumber(0, 20) / 10) +
          "s";
        squareTile.style.backfaceVisibility = "hidden";
        let x = radius * Math.cos(i) * Math.sin(t);
        let y = radius * Math.sin(i) * Math.sin(t);
        square.style.webkitTransform = "translateX(" + Math.ceil(x) +
          "px) translateY(" + y + "px) translateZ(" + z + "px)";
        square.style.transform = "translateX(" + x + "px) translateY(" + y +
          "px) translateZ(" + z + "px)";

        discoBallRef.current?.appendChild(square);
      }
    }
  }, []);

  return (
    <div className="c-disco-ball">
      <div className="disco-ball-container">
        <div className="disco-ball-light">
        </div>
        <div className="disco-stick" />
        <div className="disco-ball" ref={discoBallRef}>
          <div className="disco-ball-middle"></div>
        </div>
      </div>
    </div>
  );
}
