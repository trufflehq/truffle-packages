
import { gql } from "https://tfl.dev/@truffle/api@~0.1.0/client.ts";

const MASHING_CONFIG_KEY = "mashingConfig";
const MASHING_PACKAGE_ID = "208bee01-048b-11ed-b214-24c4e95f5b37"
const MASHING_FUNCTION_ADMIN_START_ENDPOINT = "https://gxsvaymsxjpjenqvycnj.functions.supabase.co/mashing-function/admin/start"
const MASHING_FUNCTION_GAME_INCREMENT_ENDPOINT = "https://gxsvaymsxjpjenqvycnj.functions.supabase.co/mashing-function/game/increment"


export const MASHING_CONFIG_QUERY = gql`
  query MashingConfigQuery ($input: OrgKeyValueInput) {
    org {
      keyValue(input: $input) {
        key
        value
      }
    }
}
`;

export const MASHING_RANK_QUERY = gql`
  query MashingLeaderboardQuery ($input: OrgUserCounterTypeInput) {
    orgUserCounterType(input: $input) {
      orgUserCounter {
        userId
        count
        rank
      }
    }
}
`;


export const MASHING_LEADERBOARD_QUERY = gql`
  query MashingLeaderboardQuery ($input: OrgUserCounterTypeInput) {
    orgUserCounterType(input: $input) {
      orgUserCounterConnection {
        nodes {
          userId
          count
        }
      }
    }
}
`;

export const ORG_USER_COUNTER_TYPE_UPSERT = gql`
  mutation OrgUserCounterTypeUpserMutation ($input: OrgUserCounterTypeUpsertInput!) {
    orgUserCounterTypeUpsert(input: $input) {
      orgUserCounterType {
        id
        slug
        name
        decimalPlaces
      }
    }
  }
`

export const MASHING_CONFIG_MUTATION = gql`
  mutation MashingConfigMutation ($input: KeyValueUpsertInput!) {
    keyValueUpsert(input: $input) {
      keyValue {
        key
        value
      }
    }
  }
`

export const ACTION_EXECUTE_MUTATION = gql `
  mutation ActionExecute ($input: ActionExecuteInput!) {
    actionExecute(input: $input) {
        hasExecuted
    }
  }
`


export function getUpdateRemoteConfigInput(orgUserCounterTypeId: string, orgId: string, endTime: Date) {
  return {
    input: {
      actionPath: "@truffle/core@latest/_Action/webhook",
      runtimeData: {
        endpoint: MASHING_FUNCTION_ADMIN_START_ENDPOINT,
        orgUserCounterTypeId: orgUserCounterTypeId,
        orgId,
        endTime: endTime,
      },
      packageId: MASHING_PACKAGE_ID
    },
  };
}

export function getRemoteIncrementInput(orgId: string) {
  return {
    input: {
      actionPath: "@truffle/core@latest/_Action/webhook",
      runtimeData: {
        endpoint: MASHING_FUNCTION_GAME_INCREMENT_ENDPOINT,
        orgId
      },
      packageId: MASHING_PACKAGE_ID
    },
  };
}


export function getCreateOrgUserCounterTypeInput(orgId: string) {
  return {
    input: {
      slug: `mashingConfig-${orgId}-${crypto.randomUUID()}`,
    },
  };
}

export function getUpdateConfigInput(orgUserCounterTypeId: string, endTime: Date) {
  return {
    input: {
      sourceType: "org",
      key: MASHING_CONFIG_KEY,
      value: JSON.stringify({
        orgUserCounterTypeId,
        endTime,
      }),
    },
  };
}