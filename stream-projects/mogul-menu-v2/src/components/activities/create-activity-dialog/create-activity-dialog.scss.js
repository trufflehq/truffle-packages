import { scss } from "../../../deps.ts";

export default scss`
.c-create-activity-dialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 100%;

  .c-dialog {
    
    @media (min-width: 600px) {
      width: 540px !important;
      height: 100%;
    }
  }

  .body {
    padding: 0 24px 24px 24px;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr;

    @media (min-width: 600px) {
      grid-template-columns: 1fr 1fr;
    }
    gap: 12px;
  }
}

.c-create-activity-tile {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 16px 24px;
  background: var(--mm-color-bg-tertiary);
  box-sizing: border-box;
  border-radius: 4px;

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    padding: 8px;
    box-sizing: border-box;
  }

  .title {
    margin-top: 12px;
  }

  .description {
    font-size: 14px;
    font-weight: 400;
    color: var(--mm-color-text-demphasized);
    text-align: center;
    margin-top: 8px;
  }

  .action-button {
    margin-top: 20px;
    box-sizing: border-box;
    height: 40px;
  }
}
`;
