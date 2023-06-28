import { scss } from "../../../deps.ts";

export default scss`
@mixin flex-column {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.c-chat-settings-page {
  @include flex-column;

  height: 100%;
  box-sizing: border-box;
  padding: 48px 74px;


  > .hero {
    @include flex-column;

    align-items: center;
    justify-content: center; 
    text-align: center;
    color: var(--mm-color-text-bg-primary);
    
    > .title {
      margin-top: 8px;
      font-size: 36px;
      font-weight: 700;
      display: none;

      @media (min-width: 600px) {
        display: block;
      }
    }

    > .welcome {
      margin-top: 24px;
      font-weight: 700;
      font-size: 20px;
    }

    > .info {
      margin-top: 4px;
      font-weight: 400;
      font-size: 16px;
    }
  }
  
  > .settings {
    @include flex-column;
    
    width: 100%;
    margin-top: 40px;

    > .username {
      width: 100%;

      > .label {
        display: flex;
        width: 100%;
        font-size: 14px;
      }
    }

    .name-color-input {
      margin-top: 8px;
    }
  }

  > footer {
    display: flex;
    justify-content: flex-end;
  }
}
`;
