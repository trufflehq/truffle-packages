import { React, useEffect, useRef, useStyleSheet } from "../../deps.ts";
import stylesheet from "./disco-ball.scss.js";
// https://codepen.io/msaetre/pen/eYwqrb

const DISCO_BALL_RADIUS = 50;
const DISCO_BALL_SQUARE_WIDTH = 6.5;
const PRECISION = 19.55;
const DEFAULT_FUZZY_FACTOR = 0.001;

function randomColor(type: "bright" | "any") {
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

function getRadius(radius: number, t: number) {
  return Math.abs(
    (radius * Math.cos(0) * Math.sin(t)) -
      (radius * Math.cos(Math.PI) * Math.sin(t)),
  ) / 2.5;
}

function setSquareTileStyles(
  { squareTile, squareSize, i, t }: {
    squareTile: HTMLDivElement;
    squareSize: number;
    i: number;
    t: number;
  },
) {
  squareTile.style.width = `${squareSize}px`;
  squareTile.style.height = `${squareSize}px`;
  squareTile.style.transformOrigin = "0 0 0";
  squareTile.style.webkitTransformOrigin = "0 0 0";
  squareTile.style.webkitTransform = `rotate(${i}rad) rotateY(${t}rad)`;
  squareTile.style.transform = `rotate(${i}rad) rotateY(${t}rad)`;
  if ((t > 1.3 && t < 1.9) || (t < -1.3 && t > -1.9)) {
    squareTile.style.backgroundColor = randomColor("bright");
  } else {
    squareTile.style.backgroundColor = randomColor("any");
  }

  squareTile.style.webkitAnimation = "reflect 2s linear infinite";
  squareTile.style.webkitAnimationDelay = String(randomNumber(0, 20) / 10) +
    "s";
  squareTile.style.animation = "reflect 2s linear infinite";
  squareTile.style.animationDelay = String(randomNumber(0, 20) / 10) +
    "s";
  squareTile.style.backfaceVisibility = "hidden";
}

function setSquareStyles(
  { square, squareTile, radius, i, t, z }: {
    square: HTMLDivElement;
    squareTile: HTMLDivElement;
    radius: number;
    i: number;
    t: number;
    z: number;
  },
) {
  const x = radius * Math.cos(i) * Math.sin(t);
  const y = radius * Math.sin(i) * Math.sin(t);
  square?.appendChild(squareTile);
  square.className = "square";
  square.style.webkitTransform = `translateX(${
    Math.ceil(x)
  }px) translateY(${y}px) translateZ(${z}px)`;
  square.style.transform =
    `translateX(${x}px) translateY(${y}px) translateZ(${z}px)`;
}

function animateDiscoBallSquares(
  { discoBallRef, radius, squareSize, fuzzy, angleInc, t, z }: {
    discoBallRef: React.MutableRefObject<HTMLDivElement | null>;
    radius: number;
    squareSize: number;
    fuzzy: number;
    angleInc: number;
    t: number;
    z: number;
  },
) {
  for (let i = angleInc / 2 + fuzzy; i < (Math.PI * 2); i += angleInc) {
    const square = document.createElement("div");
    const squareTile = document.createElement("div");

    setSquareTileStyles({ squareTile, squareSize, i, t });
    setSquareStyles({ square, squareTile, radius, i, t, z });

    discoBallRef.current?.appendChild(square);
  }
}

function useDiscoBallAnimationHandler(
  { discoBallRef }: {
    discoBallRef: React.MutableRefObject<HTMLDivElement | null>;
  },
) {
  useEffect(() => {
    const radius = DISCO_BALL_RADIUS;
    const squareSize = DISCO_BALL_SQUARE_WIDTH;
    const fuzzy = DEFAULT_FUZZY_FACTOR;
    const increment = (Math.PI - fuzzy) / PRECISION;

    for (let t = fuzzy; t < Math.PI; t += increment) {
      const z = radius * Math.cos(t);
      const currentRadius = getRadius(radius, t);
      const circumference = Math.abs(2 * Math.PI * currentRadius);
      const squaresThatFit = Math.floor(circumference / squareSize);
      const angleInc = (Math.PI * 2 - fuzzy) / squaresThatFit;

      animateDiscoBallSquares({
        discoBallRef,
        radius,
        squareSize,
        fuzzy,
        angleInc,
        t,
        z,
      });
    }
  }, []);
}

export default function DiscoBall() {
  useStyleSheet(stylesheet);
  const discoBallRef = useRef<HTMLDivElement>(null);
  useDiscoBallAnimationHandler({ discoBallRef });

  return (
    <div className="c-disco-ball">
      <div className="disco-ball-container">
        <div className="disco-ball-light" />
        <div className="disco-stick" />
        <div className="disco-ball" ref={discoBallRef}>
          <div className="disco-ball-middle" />
        </div>
      </div>
    </div>
  );
}
