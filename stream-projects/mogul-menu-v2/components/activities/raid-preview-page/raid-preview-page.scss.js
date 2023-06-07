import { scss } from "../../../deps.ts";

export default scss`
.c-raid-preview-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 0px 72px 24px 72px;

  .title {
    font-size: 22px;
    font-weight: 600;
  }

  .description {
    font-size: 16px;
    font-weight: 400;
  }

  .preview {
    margin-top: 40px;
    width: 100%;

    > iframe {
      width: 100%;
      height: 234px;
    }
  }

  .info {
    font-size: 14px;
    font-weight: 400;
    color: var(--mm-color-text-demphasized);
  }
  
  > .error {
    display: flex;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: var(--error-red);
  }
}

.c-raid-preview-page__footer {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
`;
