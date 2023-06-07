import { scss } from "../../deps.ts";

export default scss`
.c-king-tile {
  > .inner {

    > .content {
      flex: 1;
      padding: 20px 16px;
      display: flex;
      gap: 12px;
      align-items: center;

      > .info {
        max-width: 100%;
        overflow: hidden;
        position: relative;

        > .username {
          margin-bottom: 4.5px;
          font-weight: 400;
          font-size: 16px;
          letter-spacing: 0.005em;
        }

        > .powerups {
          display: flex;
          align-items: center;
          gap: 10px;

          > .powerup {
            width: 24px;
            height: 24px;
          }
        }
      }
    }
  }
}
`;
