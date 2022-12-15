import {
  jumper,
  React,
  useEffect,
  useState,
  useStyleSheet,
} from "../../../deps.ts";

import stylesheet from "./cubes.scss.js";
const NUM_CUBES = 25;

const CUBE_COLORS = [
  "#7D48FF",
  "#FF1D54",
];

const range = (start: number, end?: number, step = 1) => {
  const output: number[] = [];
  if (typeof end === "undefined") {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    output.push(i);
  }
  return output;
};

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const generateSquare = (
  { color, top }: { color: string; top?: number },
) => {
  return {
    id: String(random(10000, 99999)),
    createdAt: Date.now(),
    // Bright yellow color:
    color,
    size: random(5, 18),
    style: {
      // Pick a random spot in the available space
      top: `${top ?? random(0, 100)}%`,
      left: `${random(45, 90)}%`,
      // Float sparkles above sibling content
      zIndex: 2,
    },
  };
};

export function useCubes() {
  useStyleSheet(stylesheet);

  const [cubes] = useState(() => {
    return range(NUM_CUBES).map((i) =>
      generateSquare({
        top: i < NUM_CUBES / 2 ? random(0, 50) : random(50, 100),
        color: i < NUM_CUBES / 2 ? CUBE_COLORS[0] : CUBE_COLORS[1],
      })
    );
  });

  return { cubes };
}

export function Cube(
  { size, color, top, left }: {
    size: number;
    color: string;
    top: string;
    left: string;
  },
) {
  return (
    <div
      className="cube"
      style={{
        width: size,
        height: size,
        top,
        left,
        transform: "rotateX(240deg) rotateY(-10deg) rotateZ(-135deg)",
      }}
    >
      <div
        className="side top"
        style={{
          background: color,
          transform: `translateZ(-${size}px)`,
          borderTop: `1px solid ${color}`,
          borderLeft: `1px solid ${color}`,
        }}
      >
      </div>
      <div
        className="side left"
        style={{
          background: color,
          width: `${size}px`,
          transform: `translateZ(-${size}px) rotateY(90deg)`,
          border: `1px solid ${color}`,
        }}
      >
      </div>
      <div
        className="side front"
        style={{
          background: color,
        }}
      >
      </div>
    </div>
  );
}
