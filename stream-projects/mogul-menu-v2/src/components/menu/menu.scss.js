import { scss } from "../../deps.ts";

export default scss`
@mixin badge($location: bottom-right, $width: 6px, $height: 6px, $stroke: rgba(0, 0, 0, 1)) {
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    border: 1px solid $stroke;
    width: $width;
    height: $height;
    background: red;

    @if $location ==bottom-right {
      right: 4px;
      bottom: 4px;
    }

    @else if $location ==top-right {
      right: -4px;
      top: 0;
    }

    @else if $location ==outer-top-right {
      right: calc(-#{$width} * 1 / 3);
      top: calc(-#{$height} * 1 / 3);
    }

    @else if $location ==outer-bottom-right {
      right: calc(-#{$width} * 1 / 3);
      bottom: calc(-#{$height} * 1 / 3);
    }

    @else if $location ==outer-top-left {
      left: calc(-#{$width} * 1 / 3);
      top: calc(-#{$height} * 1 / 3);
    }
  }
}

@mixin roundedTriangle() {

  // https://stackoverflow.com/questions/14446677/how-to-make-3-corner-rounded-triangle-in-css
  .triangle {
    position: absolute;
    right: 12px;
    top: -4px;
    background-color: var(--tertiary-base);
    text-align: left;
    z-index: 1;
  }

  .triangle:before,
  .triangle:after {
    content: '';
    position: absolute;
    background-color: inherit;
  }

  .triangle,
  .triangle:before,
  .triangle:after {
    width: 20px;
    height: 20px;
    border-top-right-radius: 30%;
  }

  .triangle {
    transform: rotate(-60deg) skewX(-30deg) scale(1, .866);
  }

  .triangle:before {
    transform: rotate(-135deg) skewX(-45deg) scale(1.414, .707) translate(0, -50%);
  }

  .triangle:after {
    transform: rotate(135deg) skewY(-45deg) scale(.707, 1.414) translate(50%);
  }
}

// space for notification icon to show
$extension-top-offset: 10px;
$extension-right-offset: 10px;

$tab-body-padding: 16px;
$snackbar-container-width: 95%;
$closed-offest-width: 60px;

$ease-function: cubic-bezier(.4, .71, .18, .99);
$clip-path-transition: .5s;

html, body {
  color-scheme: only light; /* otherwise dark mode inverts images and text too much */
}

:root {
  color-scheme: only light;
}

.c-browser-extension-menu {
  height: 100%;
  width: 100%;
  position: relative;

  --error-red: rgba(238, 113, 113, 1);
  --success-green: rgba(107, 190, 86, 1);

  // TODO: rm this when we either include it in the design system or have it as a component prop
  --truffle-gradient: linear-gradient(281.86deg, #71DBDB 2.63%, #ADACDD 50.48%, #FF9DC6 94.5%);

  &.position-bottom-right, &.position-bottom-left {
    > .menu {
      > .inner {
        > .bottom {
          order: 2;
        }
        > .body {
          order: 1;
        }
      }
    }
  }

  &.position-top-left, &.position-bottom-left {
    > .menu {
      > .inner {
        > .bottom {
          > .c-tab-bar {
            flex-direction: row;
            order: 2;
          }
          > .c-extension-icon {
            order: 1;
          }
        }
      }
    }
  }

  > .menu {
    transition: clip-path $clip-path-transition cubic-bezier(.4, .71, .18, .99);
    
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: var(--mm-color-bg-primary);
    color: var(--mm-color-text-bg-primary);
    font-family: var(--mm-font-family);

    > .inner {
      height: 100%;
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;

      > .body {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;

        > .tab-body {
          flex: 1;
          box-sizing: border-box;
          min-height: 0;
  
          &::-webkit-scrollbar {
            width: 0;
            background: transparent;
          }
        }
      }

      > .bottom {
        display: flex;
        justify-content: flex-end;
        max-height: 48px;
        width: 100%;
      }
    }
  }
}

// TODO: reimplement tool tips
.c-extension-user-tooltip {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  background: var(--tertiary-base);
  max-width: 200px;
  width: 100%;

  @media (min-width: 768px) {
    max-width: 232px;
  }

  > .message {
    position: relative;
    z-index: 2;
  }

  > .button {
    display: flex;
    justify-content: flex-end;
    margin-top: 4px;

    >button {
      padding: 16px 8px;
      border-radius: 4px;
    }
  }

  @include roundedTriangle();
}
`;
