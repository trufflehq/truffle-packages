import {
  jumper,
  React,
  useEffect,
  useState,
  useStyleSheet,
} from "../../deps.ts";
import stylesheet from "./drlupo-stjude-theme.scss.js";
const setJumperYoutubeStyles = () => {
  const style = {
    width: "100%",
    height: "100%",
    background: "transparent",
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    "pointer-events": "none",
    "z-index": "-1",
  };
  jumper.call("layout.applyLayoutConfigSteps", {
    layoutConfigSteps: [
      {
        action: "setStyleSheet",
        value: {
          id: "drlupo-stjude-chat-styles",
          css: `
          :root {
            /* chat bg */
            --yt-live-chat-product-picker-hover-color: #141456 !important;
            --yt-live-chat-background-color: #141456 !important;
            --yt-live-chat-primary-text-color: #ffffff !important;
            --yt-live-chat-secondary-text-color: #eeeeee !important;

            /* context chat styles */
            --yt-live-chat-header-background-color: #0B0B1F !important;
            --yt-live-chat-action-panel-background-color: #0B0B1F !important;
            --yt-live-chat-message-highlight-background-color: #0B0B1F !important;
            --yt-live-chat-ninja-message-background-color: #0B0B1F !important;
            --yt-live-chat-vem-background-color: #0B0B1F !important;
            --yt-live-chat-banner-gradient-scrim: #0B0B1F !important;
            --yt-spec-menu-background: #0B0B1F !important;
            --yt-spec-raised-background: #0B0B1F !important;
            --yt-spec-text-primary: #ffffff !important;
          }

          #item-scroller.yt-live-chat-item-list-renderer::-webkit-scrollbar-track {
            background: #232255 !important;
          }

          #action-buttons.yt-live-chat-header-renderer::before {
            content: "";
            width: 71px;
            height: 24px;
            position: absolute;
            top: 12px;
            right: 40px;
            background-image: url(https://cdn.bio/assets/images/features/browser_extension/chat-themes/drlupo-stjude/logo.svg);
            background-size: 100%;
            background-repeat: no-repeat;
          }        
          `,
        },
      },
      { action: "useSubject" },
      { action: "setStyle", value: style },
    ],
  });
};

export const onCleanup = () => {
  jumper.call("layout.applyLayoutConfigSteps", {
    layoutConfigSteps: [
      {
        action: "setStyleSheet",
        value: {
          id: "drlupo-stjude-chat-styles",
          css: ``,
        },
      },
    ],
  });
};
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

const NUM_SQUARES = 25;

const SQUARE_COLORS = [
  "#7D48FF",
  "#FF1D54",
];

const generateSquare = ({ color, top }: { color: string; top?: number }) => {
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

// a long test message
// write a long comment about foo bar
// this is a long comment

export default function DrLupoStJudeTheme() {
  useStyleSheet(stylesheet);
  const [squares, setSquares] = useState(() => {
    return range(NUM_SQUARES).map((i) =>
      generateSquare({
        top: i < NUM_SQUARES / 2 ? random(0, 50) : random(50, 100),
        color: i < NUM_SQUARES / 2 ? SQUARE_COLORS[0] : SQUARE_COLORS[1],
      })
    );
  });

  useEffect(() => {
    setJumperYoutubeStyles();
  }, []);

  console.log("squares", squares);
  return (
    <div className="c-drlupo-stjude-theme">
      <div className="background" />
      {squares.map((square) => (
        <Cube
          size={square.size}
          color={square.color}
          top={square.style.top}
          left={square.style.left}
        />
      ))}
    </div>
  );
}

function Cube(
  { size, color, top, left }: {
    size: number;
    color: string;
    top: string;
    left: string;
  },
) {
  return (
    // <div
    //   className="floatwrap"
    //   style={{
    //     top,
    //     left,
    //     position: "absolute",
    //   }}
    // >
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
    // </div>
  );
}

function CubeFace({ size }: { size: number }) {
  return (
    <div
      className="cube_face"
      style={{
        width: size,
        height: size,
        top: size / 2,
        left: size / 2,
      }}
    />
  );
}
