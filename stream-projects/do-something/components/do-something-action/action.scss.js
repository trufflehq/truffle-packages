import { scss } from "../../deps.ts";

export default scss`
  .c-recent-action {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    background: var(--background);
    padding: var(--padding);
    border-radius: 4px;
    color: var(--text-color-normal);

    .profile {
      justify-self: start;
      display: flex;
      align-items: center;
      gap: 12px;

      .username {
        font-style: normal;
        font-weight: var(--font-weight-normal);
        font-size: var(--font-size-normal);
      }
    }

    .collectible {
      justify-self: center;
      display: flex;
      align-items: center;
      gap: 8px;

      .icon {
        > img {
          display: block;
          width: var(--collectible-icon-size);
        }
      }

      .name {
        font-style: normal;
        font-weight: var(--font-weight-normal);
        font-size: var(--font-size-normal);
      }
    }

    .time-since {
      font-style: normal;
      font-weight: var(--font-weight-demphasized);
      font-size: var(--font-size-demphasized);
      color: var(--text-color-demphasized);
      justify-self: end;
    }
  }
`;
