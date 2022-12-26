import { scss } from "../../deps.ts";

export default scss`
html, body {
  color-scheme: only light; /* otherwise dark mode inverts images and text too much */
}

:root {
  color-scheme: only light;
}

.c-channel-points {
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;
  min-height: 30px;
  max-height: 40px;

  &.expanded {   
    .points {
      padding-right: 16px !important;
    }
    
    .claim {
      border-radius: 2px !important;
      
      > .title {
        display: flex;
        align-items: center;
        margin-left: 4px;
      }
    }
  }

  &.collapsed {
    > .inner {
      background: rgba(33, 33, 33, 0.98);
    }
  }

  > .inner {
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 4px;

    > .coin {
      margin-right: 5px;
    }
  
    > .timer {
      margin-right: 8px;
    }
  
    > .points {
      padding-right: 8px;
      font-size: 12px;
      font-family: var(--mm-font-family);
      color: var(--mm-color-text-bg-primary);
    }
  
    > .claim {
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      padding: 2px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      background-color: var(--mm-gradient);
      color: #000000; // color on gradient, don't have a var atm
  
      animation: claim-shake 2s infinite cubic-bezier(.36,.07,.19,.97) both;
      backface-visibility: hidden;
      transform-origin: bottom;
    }
  }

  @keyframes claim-shake {
    0% { transform: rotate(0); }
    40% { transform: rotate(1deg); }
    45% { transform: rotate(-5deg); }
    50% { transform: rotate(4deg); }
    52% { transform: rotate(-4deg); }
    56% { transform: rotate(2deg); }
    59% { transform: rotate(-2deg); }
    61% { transform: rotate(1deg); }
    100% { transform: rotate(0); }
  }
}
`;
