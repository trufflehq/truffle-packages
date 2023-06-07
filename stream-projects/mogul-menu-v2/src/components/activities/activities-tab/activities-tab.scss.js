import { scss } from "../../../deps.ts";

export default scss`
.c-activities-tab {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  padding: 24px 32px 0px 32px;
  box-sizing: border-box;
  overflow-y: auto;

  .list {
    margin-bottom: 40px;
  
    > .list-header {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 24px;
    }

    > .list-group {
      gap: 8px;
      display: flex;
      flex-direction: column;
    }

    > .empty-list-group {
      display: flex;
      justify-content: center;
      color: var(--mm-color-text-demphasized);
      font-size: 16px; 
      font-weight: 600;
    }
  }

  .start {
    margin-top: 20px;
    width: 100%;
  }
}
`;
