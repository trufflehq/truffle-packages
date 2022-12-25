import { scss } from "../../../deps.ts";

export default scss`
.c-create-raid-page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0px 72px 24px 72px;

  .title {
    font-size: 16px;
    font-weight: 600;
  }

  .inputs {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    gap: 32px;
  }

  > .error {
    display: flex;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: var(--error-red);
  }
}

.c-raid-link-preview {
  display: flex;
  flex-direction: column;

  > iframe {
    width: 100%;
    height: 210px;
  }

  > .remove {
    margin-top: 8px;
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    text-align: center;
    transition: text-decoration 0.2s ease-in-out;    
    text-decoration: underline;
  }
}
`;
