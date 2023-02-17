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

.c-tab-bar {
  flex-direction: row-reverse;
  box-sizing: border-box;
  height: 40px;

  display: flex;
  overflow-x: overlay;
  overflow-y: overlay;
  flex: 1;
  z-index: 1000;

  /* scrollbar fix for firefox */
  @-moz-document url-prefix() { 
    overflow-x: auto;
  }

  &.is-collapsed {
    overflow: hidden;
    > .tab {
      opacity: 0;
    }
  }

  >.tab {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    position: relative;

    padding: 0px 12px;

    &:hover {
      background-color: var(--mm-color-bg-tertiary);
    }

    &.is-active {
      background-color: var(--mm-color-bg-tertiary);
    }

    &.has-badge>.icon {
      position: relative;
      @include badge(top-right);
    }

    >.icon {
      margin-right: 8px;
      // in ios safari click events seem to stop propagating at the web component level vs going up to other
      // web components / root (different behavior from every other browser including mac safari)
      pointer-events: none;
    }

    >.title {
      white-space: nowrap;
    }
  }

  > .additional-tab-buttons {
    flex-shrink: 0;
    display: flex;
  }
}
// .tabs {
//   overflow: hidden;
// }
.c-collapsible-tab-button {
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
`;
