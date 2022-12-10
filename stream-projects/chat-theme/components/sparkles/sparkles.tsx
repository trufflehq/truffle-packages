import {
  React,
  useCallback,
  useEffect,
  useRef,
  useState,
  useStyleSheet,
} from "../../deps.ts";
import stylesheet from "./sparkles.scss.js";

const STARTING_SPARKLES = 20;
const NUM_GENERATED_SPARKLES = 10;
const ANIMATION_DURATION_MS = 2000;
const LOWER_RND_BOUND_MS = 350;
const UPPER_RND_BOUND_MS = 750;

// https://www.joshwcomeau.com/react/animated-sparkles-in-react/
// thanks for generating colors chatGPT
const COLORS = [
  "#FF38D3",
  "#F868D3",
  "#F08FD2",
  "#E9B6D1",
  "#E3DDD0",
  "#DDF3CE",
  "#D80ACC",
  "#D224CB",
  "#CB47CA",
  "#C56CC9",
  "#BE8FC8",
  "#B8B4C7",
  "#B2DAC6",
  "#ABFEC5",
  "#A521C4",
  "#9E44C3",
  "#976AC2",
  "#908EC1",
  "#89B1C0",
  "#82D4BF",
  "#7BF8BE",
  "#7418BD",
  "#6D3BBC",
  "#6665BB",
  "#5F86BA",
  "#58A9B9",
  "#51CBB8",
  "#4AF0B7",
  "#4314B6",
  "#3C39B5",
  "#3560B4",
  "#2E83B3",
  "#27A6B2",
  "#20CAB1",
  "#19EDB0",
  "#1312AF",
  "#0C35AE",
  "#0559AD",
  "#FF7DAC",
  "#F8A1AB",
  "#F1C5AA",
  "#EAF9A9",
  "#E41DA8",
  "#DD41A7",
  "#D664A6",
  "#CF88A5",
  "#C8ABA4",
  "#C1CFA3",
  "#BBF2A2",
  "#B517A1",
  "#AE3BA0",
  "#A85F9F",
  "#A1849E",
  "#9AA89D",
  "#93CC9C",
  "#8CF19B",
  "#86159A",
  "#7F3999",
  "#786898",
  "#719197",
  "#6AB596",
  "#63D995",
  "#5D0D94",
  "#564193",
  "#4F6992",
  "#489211",
  "#40D3F3",
];

const SPARKLE_PATHS = [
  "M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z", // diamond thing
  "M34.1053 0L38.7597 34.9729L68.2105 40.5L38.7597 46.0271L34.1053 81L29.4509 46.0271L0 40.5L29.4509 34.9729L34.1053 0Z", // start
  "M27.641 8.13528L26.6205 23.5214C26.4539 26.0337 24.928 28.2542 22.6424 29.3105L8.64489 35.7791L22.9626 41.5043C25.3005 42.4391 26.9408 44.5765 27.239 47.0765L29.0656 62.3879L38.935 50.5401C40.5465 48.6056 43.0861 47.706 45.556 48.1949L60.6825 51.1892L52.4643 38.1417C51.1224 36.0113 51.0517 33.318 52.2799 31.12L59.802 17.6592L44.8535 21.4432C42.4127 22.0611 39.8293 21.2961 38.1185 19.4488L27.641 8.13528ZM27.3878 1.11275C26.0206 -0.363516 23.5507 0.511316 23.4175 2.51901L22.0447 23.2179C21.9891 24.0553 21.4805 24.7955 20.7186 25.1476L1.88782 33.8499C0.0613226 34.694 0.130102 37.3133 1.99838 38.0604L21.26 45.7624C22.0393 46.074 22.586 46.7864 22.6854 47.6198L25.1428 68.2181C25.3811 70.216 27.8935 70.96 29.1813 69.4141L42.4585 53.4752C42.9957 52.8304 43.8422 52.5305 44.6655 52.6935L65.0151 56.7217C66.9889 57.1124 68.4728 54.9529 67.4005 53.2504L56.3446 35.6976C55.8973 34.9875 55.8738 34.0897 56.2832 33.3571L66.4025 15.2483C67.3841 13.4918 65.7888 11.4132 63.8382 11.9069L43.7282 16.9976C42.9146 17.2035 42.0534 16.9485 41.4832 16.3328L27.3878 1.11275Z", // tiny start
  "M27.8012 2.12758C28.9903 -0.709198 33.0097 -0.709193 34.1988 2.12759L41.817 20.3009C42.1182 21.0195 42.6526 21.6157 43.3341 21.9935L60.2132 31.351C62.5956 32.6718 62.5956 36.0974 60.2132 37.4181L43.3341 46.7757C42.6526 47.1534 42.1182 47.7497 41.817 48.4683L34.1988 66.6416C33.0097 69.4784 28.9903 69.4784 27.8012 66.6416L20.183 48.4683C19.8818 47.7497 19.3474 47.1534 18.6659 46.7757L1.78678 37.4181C-0.595589 36.0974 -0.595593 32.6718 1.78677 31.3511L18.6659 21.9935C19.3474 21.6157 19.8818 21.0195 20.183 20.3009L27.8012 2.12758Z", // twinkle
];

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const generateSparkle = (color) => {
  return {
    id: String(random(10000, 99999)),
    createdAt: Date.now(),
    // Bright yellow color:
    color,
    size: random(10, 20),
    path: SPARKLE_PATHS[Math.floor(Math.random() * SPARKLE_PATHS.length)],
    style: {
      // Pick a random spot in the available space
      top: `${random(0, 100)}%`,
      left: `${random(0, 100)}%`,
      // Float sparkles above sibling content
      zIndex: 2,
    },
  };
};

function SparkleInstance({ color, size, style, path }) {
  return (
    <div className="c-sparkle-instance" style={style}>
      <svg width={size} height={size} viewBox="0 0 68 68" fill="none">
        <path d={path} fill={color} />
      </svg>
    </div>
  );
}

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

const useRandomInterval = (
  callback: () => void,
  minDelay: number,
  maxDelay: number,
) => {
  const timeoutIdRef = useRef<number>(undefined!);
  const savedCallbackRef = useRef(callback);
  useEffect(() => {
    savedCallbackRef.current = callback;
  });

  useEffect(() => {
    const isEnabled = typeof minDelay === "number" &&
      typeof maxDelay === "number";
    if (isEnabled) {
      const handleTick = () => {
        const nextTickAt = random(minDelay, maxDelay);

        timeoutIdRef.current = window.setTimeout(() => {
          savedCallbackRef.current();
          handleTick();
        }, nextTickAt);
      };

      handleTick();
    }

    return () => window.clearTimeout(timeoutIdRef.current);
  }, [minDelay, maxDelay]);
  const cancel = useCallback(() => {
    window.clearTimeout(timeoutIdRef.current);
  }, []);
  return cancel;
};

export default function Sparkles({ color = "#FF38D3", children }) {
  useStyleSheet(stylesheet);
  const [sparkles, setSparkles] = useState(() => {
    return range(STARTING_SPARKLES).map(() => generateSparkle(color));
  });

  useRandomInterval(
    () => {
      const now = Date.now();
      // Create new sparkles
      const newSparkles = range(NUM_GENERATED_SPARKLES).map(() => {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        return generateSparkle(color);
      });

      // Clean up any "expired" sparkles
      let nextSparkles = sparkles.filter((sparkle) => {
        const delta = now - sparkle.createdAt;

        return delta < ANIMATION_DURATION_MS;
      }) || [];

      // Include our new sparkle
      // nextSparkles.push(sparkle);
      nextSparkles = nextSparkles.concat(newSparkles);

      // Make it so!
      setSparkles(nextSparkles);
    },
    LOWER_RND_BOUND_MS,
    UPPER_RND_BOUND_MS,
  );

  return (
    <span className="c-sparkles">
      {sparkles?.map((sparkle) => (
        <SparkleInstance
          key={sparkle.id}
          color={sparkle.color}
          size={sparkle.size}
          style={sparkle.style}
          path={sparkle.path}
        />
      ))}
      <strong className="child-wrapper">
        {children}
      </strong>
    </span>
  );
}
