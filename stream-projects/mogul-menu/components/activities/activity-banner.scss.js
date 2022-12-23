import { scss } from "../../deps.ts";

export default scss`
  .c-activity-banner {
    display: flex;
    position: relative;
    overflow: hidden;
    width: 100%;
    background: var(--mm-color-bg-primary);
    box-sizing: border-box;
    border: 1px solid var(--mm-color-border-primary);
    padding: 8px 14px;
    height: 52px;
    font-family: var(--mm-secondary-font-family);

    &.is-closed {
      display: none;
    }
  }
`;
