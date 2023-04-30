import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
.c-premium-content-embed {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: Roboto;

  > .patreon-content {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;

    &.is-collapsed {
      > .top {
        padding: 8px;
        height: 30px;

        > .info {
          > .description {
            display: none;
          }
        }
      }
    }

    > .top {
      text-decoration: none;
      width: 100%;
      padding: 12px 16px;
      box-sizing: border-box;
      background: #292829;
      color: #fff;
      display: flex;
      align-items: center;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;

      > .icon {
        margin-right: 16px;
      }

      > .info {
        > .title {
          font-weight: 600;
          font-size: 16px;
          line-height: 19px;
        }

        > .description {
          font-weight: 400;
          font-size: 14px;
          line-height: 16px;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 2px;
        }
      }

      > .close {
        margin-left: auto;
      }
    }

    > .content {
      padding: 16px;
      background: #111;
      color: #fff;
      font-weight: 600;
      font-size: 16px;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      flex: 1;
      min-height: 0;
      overflow: auto;

      &::-webkit-scrollbar {
        width: 8px;
      }
      
      /* Track */
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      
      /* Handle */
      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.7);
        border-radius: 4px;
      }

      > .featured-post {
        display: block;
        color: #fff;
        text-decoration: none;

        > .preview {
          height: 208px;
          margin-bottom: 16px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          // give blur hard edges
          // https://stackoverflow.com/a/23370117
          overflow: hidden;
          -webkit-transform: translate3d(0, 0, 0);

          > .background {
            position: absolute;
            width: 100%;
            height: 100%;
            background-size: cover;
            filter: blur(4px);
            z-index: -1;
          }

          > .button {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            text-decoration: none;
            text-align: center;
            padding: 6px 16px;
            background: #FF424D;
            border-radius: 30px;
            color: #fff;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;

            &:hover {
              background: #db3842;
            }
          }
        }

        > .info {
          > .title {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          > .schedule {
            font-weight: 400;
            font-size: 14px;
            color: #FF424D;
            margin-top: 4px;
          }
        }
      }

      > .divider {
        width: 100%;
        height: 1px;
        background: rgba(255, 255, 255, 0.1);
        margin: 16px 0;
      }

      > .posts {
        > .title {
          margin-bottom: 12px;
          font-weight: 400;
          font-size: 14px;
          text-transform: uppercase;
        }

        > .post {
          display: flex;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          text-decoration: none;
          padding: 4px 0;

          &:hover {
            background: #222;
          }
          
          > .thumbnail {
            width: 128px;
            flex-shrink: 0;
            height: 72px;
            background-size: cover;
            background-repeat: no-repeat;
            margin-right: 8px;
            border-radius: 4px;
          }

          > .info {
            padding: 2px 0;
          }
        }
      }
    }
  }

  .discord-promo {
    margin-top: 20px;
    color: #fff;
    display: flex;
    font-size: 13px;
    font-weight: 400;
    padding: 0 8px;
  
    > .logos {
      display: flex;
      gap: 8px;
      margin-right: 12px;
  
      > .logo {
        width: 16px;
        height: 16px;
      }
  
      > .divider {
        width: 1px;
        height: 100%;
        background: rgba(255, 255, 255, 0.3);
      }
    }
  
    > a {
      color: #F357A1;
      margin-left: 4px;
    }
  }
}`;
