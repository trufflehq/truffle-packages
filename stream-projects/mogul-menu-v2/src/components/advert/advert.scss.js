import { scss } from "../../deps.ts";

export default scss`
.c-advert {
  border: 1px solid var(--mm-color-secondary);
  border-radius: 6px;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  grid-column-end: span 2;

  >.image {
    flex: 0 1 153px;

    >img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  >.content {
    flex: 1 0 0%;
    padding: 16px 22px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 16px;

    >.text {
      >.ad {
        font-weight: 400;
        font-size: 14px;
        line-height: 21px;
        letter-spacing: 0.0025em;
        color: var(--mm-color-text-bg-primary);
      }

      >.tagline {
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.005em;
      }
    }

  }
}
`;
