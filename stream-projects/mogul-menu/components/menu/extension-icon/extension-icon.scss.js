import { scss } from "../../../deps.ts";

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

.c-extension-icon {
  cursor: pointer;
  background-image: url(https://cdn.bio/assets/images/creators/ludwig/extension_icon.png);
  background-size: 100%;
  background-repeat: no-repeat;
  background-color: rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  transition: box-shadow 0.25s;
  z-index: 1000000;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
    box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.12);
  }

  &.has-notification {
    @include badge(outer-bottom-right, 16px, 16px, rgba(0, 0, 0, 1));
  }
}

.c-extension-icon {
  background-color: var(--primary-base);
  border-radius: 0px;
  position: relative;
}
`;
