import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
.c-poll-history {
  > .empty {
    display: flex;
    justify-content: center;
  }
  
  > .poll {
    padding: var(--tfl-spacing-xl);

    header {
      padding: 0;
    }

    .title {
      font-weight: 600;
    }

    .info {
      display: flex;
      flex-direction: column;
      max-width: 40%;

      .song {
        display: flex;
      }

      .user {
        padding: 0 16px 8px 0px;
        display: flex;
        gap: 16px; 
  
        .link {
          margin-top: 16px;
        }
      }
    }
  }
}
`