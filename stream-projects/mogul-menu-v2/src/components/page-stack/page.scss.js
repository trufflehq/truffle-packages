import { scss } from "../../deps.ts";

export default scss`
$ease-function: cubic-bezier(.4,.71,.18,.99);

.c-page {
  width: 100%;
  height: 100%;
  position: absolute;
  background: var(--background);
  z-index: 5;
  display: flex;
  flex-direction: column;

  @keyframes animatebottom{
    from {
      transform: translateY(100px);
      opacity:0
    }

    to {
      transform: translateY(0);
      opacity:1
    }
  }

  &.is-animated {
    animation: animatebottom 0.4s $ease-function;
  }

  &.is-full-size {
    z-index: 1001;
    top: -40px;
    height: calc(100% + 40px);
  }

  > .body {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;


    > .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px 12px 20px;
      border-top: 1px solid rgba(var(--bg-base-text-rgb-csv), 0.16);
      border-bottom: 1px solid rgba(var(--bg-base-text-rgb-csv), 0.16);
  
      > .left {
        display: flex;
        align-items: center;
        gap: 18px;
  
        > .text {
          font-weight: 600;
          font-size: 18px;
          letter-spacing: 0.04em;
        }
  
        > .back-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          outline: none;
  
          &:focus, &:active {
            border: 2px solid var(--mm-color-primary);
          }
        }
      }
    } 
  
    > .content {
      flex: 1;
      overflow-y: overlay;
      display: flex;
      flex-direction: column;
    }
  }
  

  > .footer {
    display: flex;
    justify-content: flex-end;
    padding: 24px 32px;
    box-sizing: border-box;
    border-top: 1px solid rgba(255,255,255, 0.16);
  }
}
`;
