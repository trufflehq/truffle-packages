import { scss } from "../../../deps.ts";

export default scss`
@mixin flex-column {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.c-oauth-connection-page{
  @include flex-column;
  
  box-sizing: border-box;
  padding: 0px;
  
  > .onboard-image {
    display: none;
  }

  @media (min-width: 768px) {
    padding: 48px 32px;

    > .onboard-image {
      display: block;
    }  
  }

  > .info {
    @include flex-column;

    align-items: center;
    justify-content: center; 
    text-align: center;
    font-size: 14px;
    margin-top: 32px;
    color: var(--mm-color-text-bg-primary);

    @media (min-width: 768px) {
      font-size: 16px;
      margin-top: 40px;
    }
    
    > .title {
      font-size: 20px;
      font-weight: bold;
    }
  }

  .oauth-button {
    display: flex;
    align-items: center;
    max-width: 308px;
    box-sizing: border-box;
    margin: 20px auto 8px auto;
    padding: 12px, 20px, 12px, 20px;
    height: 42px;
    gap: 8px;
  }

  .youtube {
    background: rgba(235, 50, 25, 1);
  }

  .policies {
    margin: 0 auto;
  }
}
`;
