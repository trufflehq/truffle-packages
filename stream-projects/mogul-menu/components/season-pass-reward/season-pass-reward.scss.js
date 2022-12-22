import { scss } from "../../deps.ts";

export default scss`
.c-reward {
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 16px 0;
  border-radius: 4px;
  z-index: 2;
  gap: 12px;

  &.is-clickable {
    cursor: pointer;

    &:hover {
      background-color: var(--mm-color-bg-secondary);
    }
  }

  >.inner {
    position: relative;
    z-index: 2;

    >.image {
      margin-bottom: 8px;

      >img {
        width: 56px;
        height: 56px;
        display: block;
        margin: auto;
      }
    }

    >.name {
      font-weight: 600;
      text-align: center;
      font-size: 10px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
  }

  .status-icon {
    box-sizing: border-box;
    position: absolute;
    right: 6px;
    top: 6px;
    z-index: 3;
  }

  border: 1px solid var(--accent-color);
  background: var(--background);

  &.is-selected {
    background: var(--mm-color-bg-secondary);
  }
}
`;
