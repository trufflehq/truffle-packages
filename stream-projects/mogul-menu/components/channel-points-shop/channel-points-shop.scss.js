import { scss } from "../../deps.ts";

export default scss`
.c-channel-points-shop {
  display: flex;
  flex-direction: column;

  flex: 1;

  >.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    margin-top: 20px;
    margin-bottom: 32px;

    >.channel-points {
      display: flex;
      align-items: center;
      border: 1px solid #EBC564;
      border-radius: 4px;
      box-sizing: border-box;
      padding: 6px 12px;
      width: fit-content;
      color: #FFFFFF;

      font-size: 14px;
      font-weight: 400;

      >.icon {
        margin-right: 8px;
      }
    }

    >.title {
      text-transform: uppercase;
      font-size: 18px;
      font-family: 600;
      color: #FFFFFF;
    }
  }

  >.items {
    display: grid;
    gap: 12px;
    justify-content: center;
    grid-template-columns: repeat(auto-fit, 120px);

    >.item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 6px;
      position: relative;

      &.is-disabled {
        opacity: 0.6;
        pointer-events: none;
      }



      >.card {
        width: 120px;
        height: 140px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid var(--item-color);
        box-sizing: border-box;
        border-radius: 4px;


        >.image {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          flex: 1;
        }

        >.title {
          margin-top: 12px;
          text-align: center;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          overflow: hidden;

          font-size: 12px;
          color: #FFFFFF;
        }

        >.bottom {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;

          cursor: pointer;

          box-sizing: border-box;
          padding: 7px 0;
          margin-top: 10px;
          background-color: var(--tertiary-base);

          border-radius: 4px;
          border: 1px solid rgba(var(--bg-base-text-rgb-csv), 0.16);

          >.amount {
            color: #FFFFFF; //var(--bg-base-text);
            margin-right: 8px;
            font-size: 16px;
          }
        }
      }
    }
  }

  >.how-to-earn {
    box-sizing: border-box;
    margin-top: 44px;

    >.description {
      margin-top: 2px;
    }

    >.link {
      margin-top: 7px;
    }
  }
}
`;
