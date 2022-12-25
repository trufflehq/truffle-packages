import { scss } from "../../../deps.ts";

export default scss`
.c-oauth-connection-page{
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  text-align: center;
  flex: 1;

  > .onboard-image {
    display: none; // visible on desktop
  }

  > .title {
    font-size: 24px;
    font-weight: 700;
    margin-top: 20px;
  }

  > .description {
    font-size: 18px;
    font-weight: 400;
    margin-top: 12px;
  }

  > .button {
    margin-top: 20px;
    position: relative;

    > .loading {
      position: absolute;
      z-index: -1;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  > .policies {
    margin: 16px auto 0 auto;
  }

  @media (min-width: 768px) {
    padding: 32px 32px 8px 32px;

    > .onboard-image {
      display: block;
      background-image: url(https://cdn.bio/assets/images/features/browser_extension/extension-onboarding.png);
      background-size: 100%;
      width: 576px;
      height: 300px;
    }  
  }
}`;
