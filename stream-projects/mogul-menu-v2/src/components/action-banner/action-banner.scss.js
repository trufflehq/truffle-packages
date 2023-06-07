import { scss } from "../../deps.ts";

export default scss`
.c-action-banner {
  display: flex;
  align-items: center;
  background-color: var(--mm-color-secondary);
  box-sizing: border-box;
  padding: 2px 16px;

  >.info {
    font-size: 14px;
    line-height: 21px;
    font-weight: 600;
    color: var(--mm-color-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &.action-banner-style-twitch {
    background: #772CE8;

    >.info {
      color: rgba(255, 255, 255, 1);
    }
  }

  >.action {
    display: flex;
    justify-content: flex-end;
    flex: 1;
    margin-left: 8px;
    gap: 5px;
  }
}
`;
