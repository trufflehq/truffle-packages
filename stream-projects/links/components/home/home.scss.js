import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
.c-home {
  width: 100%;
  height: 100%;
  padding: 72px 16px;
  box-sizing: border-box;
  font-family: 'Inter';
  background: #05070E; // FIXME
  color: #fff; // FIXME
  overflow: auto;

  > .container {
    max-width: 650px;
    margin: 0 auto;

    > .profile {
      text-align: center;
      margin-bottom: 48px;

      > .avatar {
        width: 96px;
        height: 96px;
        border-radius: 50%;
        margin: 0 auto;
        border: 1px solid #fff; // FIXME
        margin-bottom: 12px;
        background-size: cover;
        background-repeat: no-repeat;
      }

      > .name {
        font-weight: 700;
        font-size: 20px;
        line-height: 24px;
      }
    }

    > .get-truffle {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      margin-bottom: 40px;

      > .logo {
        width: 178px;
        height: 40px;
        background-image: url(https://cdn.bio/assets/images/truffle-tv-landing/get-truffle.svg);
        margin: 0 auto 8px auto;
      }

      > .description {
        margin-bottom: 20px;
      }
      
      > .button {
        margin-bottom: 20px;
      }

      > .alternatives {
        display: flex;
        align-items: center;
        justify-content: center;

        > .text {
          margin-right: 18px;
          font-style: italic;
          font-weight: 500;
          font-size: 16px;
        }

        > .alternative {
          margin-right: 8px;

          &:hover {
            background: rgba(255, 255, 255, 0.08);
          }  
        }
      }
    }

    > .section-header {
      font-weight: 700;
      font-size: 16px;
      text-transform: uppercase;
      margin-bottom: 24px;
    }

    > .links {
      > .link {
        display: flex;
        padding: 16px;
        border: 1px solid #fff;
        text-decoration: none;
        color: #fff;
        border-radius: 4px;
        text-align: center;
        margin-bottom: 12px;

        &:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        > .icon {
          margin-right: 8px;
        }

        > .text {
          flex: 1;
          text-align: center;
          font-weight: 700;
          font-size: 16px;
        }
      }
    }
  }
}

.c-button {
  all: unset;
  border-radius: 4px;
  background: #F75FA7;
  height: 40px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;
  box-sizing: border-box;

  > .icon {
    margin-right: 8px;
  }

  &:hover {
    background: #db5c98;
  }

  &.outline {
    background: transparent;
    border: 1px solid #fff;
    font-weight: 500;
    font-size: 14px;
    height: 36px;
    padding: 0 16px;
  }
}
`;
