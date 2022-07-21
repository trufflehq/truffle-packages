import { GAME_ID_KEY } from "../../config.ts";
import {
  gql,
  React,
  useQuery,
  Input,
  Button,
  useMutation,
useState,
useEffect,
} from "../../deps.ts";

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

const SET_GAME_ID_MUTATION = gql`
  mutation SetGameId($input: KeyValueUpsertInput!) {
    keyValueUpsert(input: $input) {
      keyValue {
        key
        value
      }
    }
  }
`;

export default function SetGame() {

  const [inputVal, setInputVal] = useState('')

  const [{ data: kvData }] = useQuery({
    query: KV_QUERY,
    variables: { key: GAME_ID_KEY },
  });
  const loadedGameId = kvData?.org?.keyValue?.value;
  const orgId = kvData?.org?.id;

  const [_setGameIdResult, executeSetGameIdMutation] = useMutation(SET_GAME_ID_MUTATION);

  useEffect(() => {
    setInputVal(loadedGameId ?? '')
  }, [loadedGameId])

  const setGameIdHandler = async () => {
    await executeSetGameIdMutation(
      {
        "input": {
          "sourceType": "org",
          "sourceId": orgId,
          "key": GAME_ID_KEY,
          "value": inputVal
        }
      },
      {
        additionalTypenames: ['KeyValue']
      }
    )
    alert('Game id successfully set!')
  };

  return (
    <div className="c-set-game">
      <div>Current Game ID</div>
      <Input value={inputVal} onChange={(e: any) => setInputVal(e.target.value)} />
      <br />
      <Button onClick={setGameIdHandler}>Set</Button>
      <p>Send this to the bot in the game chat:<br /><code>:set-org:{orgId}</code></p>
    </div>
  );
}
