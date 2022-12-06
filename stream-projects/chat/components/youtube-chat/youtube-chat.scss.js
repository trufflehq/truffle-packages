import { scss } from "../../deps.ts";

export default scss`
.c-youtube-chat {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #181818;

  > .visible-banners {
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    width: 100%;
  }

  > .status {
    display: flex;
    justify-content: center;
    text-decoration: underline;
    cursor: pointer;
    font-family: var(--mm-font-family);
    background: var(--mm-color-secondary);
    font-size: 16px;
    line-height: 21px;
    padding: 8px;
  }
  
  .youtube {
    clip-path: inset(calc(100% - 112px) 0 0 0);
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 1;

    > iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }

  .empty {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: var(--mm-font-family);
    font-size: 16px;
    line-height: 21px;
    color: #fff;
    padding: 12px;
  }

  .input {
    position: relative;

  }
}

.landscape {
  .youtube {
    margin-top: -120px;
  }
}
`;