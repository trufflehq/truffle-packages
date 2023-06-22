import { scss } from "../../deps.ts";

export default scss`
.c-home-tab {
  padding: 16px;

  >.header {
    display: flex;
    align-items: center;

    margin-bottom: 16px;

    >.user {
      display: flex;
      flex: 1;


      >.c-account-avatar {
        margin-right: 16px;
      }

      >.info {
        display: flex;
        flex-direction: column;
        justify-content: center;

        >.top {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          gap: 10px;

          >.name {
            font-size: 20px;
            font-weight: 600;
          }

          >.powerup {
            width: 24px;
            height: 24px;
            margin-left: 8px;
          }

        }

        >.amounts {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;

          >.amount {
            display: flex;
            align-items: center;

            >.icon {
              margin-right: 8px;
            }
          }
        }

      }
    }

    >.support {
      font-size: 12px;
      line-height: 16px;
      text-decoration: underline;
      color: var(--secondary-base);
      margin-right: 16px;
      box-sizing: border-box;

      &:hover {
        color: var(--primary-base);
      }
    }


    >.actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;

      >.icon {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 8px;
        box-sizing: border-box;
        border-radius: 50%;
        border: 1px solid var(--mm-color-bg-tertiary)
      }
    }

  }

  >.tile-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;


    .new-tab-promo {
      display: block;
      height: 0;
      padding-bottom: 40%;
      border-radius: 6px;
      grid-column-end: span 2;
      background: url('https://cdn.bio/assets/images/creators/ludwig/new_tab_promo.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100%;
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-sizing: border-box;
    }
  }


  >.banner {
    font-size: 16px;
    font-weight: 600;
    background: var(--tertiary-base);
    padding: 4px 15px;
    // margin: auto (-$tab-body-padding);
  }
}
`;
