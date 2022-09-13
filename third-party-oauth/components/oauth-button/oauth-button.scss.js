import { scss } from "../../deps.ts";

export default scss`
  .oauth-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
    padding: 12px, 20px, 12px, 20px;
    height: 42px;
    gap: 8px;

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
    }

    &:active, &:focus {
      outline: none !important;
    }
  }

  .youtube {
    padding: 12px 20px !important;
    background: rgba(235, 50, 25, 1) !important;
  }
`;
