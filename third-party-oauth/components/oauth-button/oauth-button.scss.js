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

    &:active, &:focus {
      outline: none !important;
    }
  }

  .logo {
    margin-top: -2px;
  }

  .youtube {
    background: rgba(235, 50, 25, 1) !important;
  }
`;
