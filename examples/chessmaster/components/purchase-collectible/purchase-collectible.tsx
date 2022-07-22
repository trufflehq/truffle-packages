import { GAME_ID_KEY, PACKAGE_ID } from "../../config.ts";
import {
  React,
  Button,
  gql,
  useMutation,
  useQuery,
  useStyleSheet,
usePollingQuery,
} from "../../deps.ts";
import styleSheet from "./purchase-collectible.css.js";

const POLL_INTERVAL = 1000

const GET_COLLECTIBLE_QUERY = gql`
  query GetCollectible($input: CollectibleInput!) {
    collectible(input: $input) {
      id
      name
      ownedCollectible {
        count
      }
    }
  }
`;

const GET_ME_QUERY = gql`
  query GetMe {
    me {
      id
    }
  }
`;

const KV_QUERY = gql`
  query GetKeyValue($key: String!) {
    org {
      id
      keyValue(input: { key: $key }) {
        key
        value
      }
    }
  }
`;

const ACQUIRE_COLLECTIBLE_MUTATION = gql`
  mutation ExecuteCollectibleIncrement($input: ActionExecuteInput!) {
    actionExecute(input: $input) {
      hasExecuted
    }
  }
`;

const ACQUIRE_COLLECTIBLE_VARIABLES = (
  userId: string,
  collectibleId: string
) => ({
  input: {
    actionPath: "@truffle/core@latest/_Action/graphql",
    runtimeData: {
      query:
        "mutation OwnedCollectibleIncrement ($input: OwnedCollectibleIncrementInput!) {\n    ownedCollectibleIncrement(input: $input) {\n        collectible {\n            id\n            name\n            type\n        }\n\n    }\n}",
      variables: {
        input: {
          collectibleId,
          userId,
          count: 1,
        },
      },
    },
    packageId: PACKAGE_ID,
  },
});

const COLLECTIBLE_REDEEM_MUTATION = gql`
  mutation OwnedCollectibleRedeem($collectibleId: ID!, $additionalData: JSON) {
    ownedCollectibleRedeem(
      input: { collectibleId: $collectibleId, additionalData: $additionalData }
    ) {
      redeemResponse
      redeemError
    }
  }
`;

export default function PurchaseCollectible({ slug }: { slug: string }) {
  useStyleSheet(styleSheet);

  const [{ data: collectibleData }] = useQuery({
    query: GET_COLLECTIBLE_QUERY,
    variables: { input: { slug } },
  });
  const collectible = collectibleData?.collectible;
  const ownedCount = collectible?.ownedCollectible?.count ?? 0;

  const [{ data: meData }] = useQuery({ query: GET_ME_QUERY });
  const me = meData?.me;

  const [_acquireCollectibleResult, executeAcquireCollectible] = useMutation(
    ACQUIRE_COLLECTIBLE_MUTATION
  );

  const buyCollectibleHandler = async () => {
    await executeAcquireCollectible(
      ACQUIRE_COLLECTIBLE_VARIABLES(me?.id, collectible?.id),
      {
        additionalTypenames: ["Collectible"],
      }
    );
  };

  const [_redeemResult, executeRedeem] = useMutation(
    COLLECTIBLE_REDEEM_MUTATION
  );

  const { data: kvData } = usePollingQuery(POLL_INTERVAL, {
    query: KV_QUERY,
    variables: { key: GAME_ID_KEY },
  });
  const lichessGameId = kvData?.org?.keyValue?.value;

  const redeemHandler = async () => {
    const move = prompt('Please enter a move (e.g. "e2e4")') ?? "";
    const validRegex = /^[a-h][1-8][a-h][1-8]$/;

    if (validRegex.test(move)) {
      await executeRedeem(
        {
          collectibleId: collectible?.id,
          additionalData: {
            move,
            gameId: lichessGameId
          },
        },
        { additionalTypenames: ["Collectible"] }
      );
    } else {
      alert('Please enter a move in the format "e2e4"');
    }
  };

  if (!collectible) return <>Loading...</>;

  return (
    <div className="c-purchase-collectible">
      <div className="collectible-info">
        {collectible?.name} x{ownedCount}
      </div>
      <Button onClick={redeemHandler} disabled={ownedCount < 1}>Redeem</Button>
      <Button onClick={buyCollectibleHandler}>Buy collectible</Button>
    </div>
  );
}
