import { gql, GQLResponse, graphqlReq } from "./graphql-client.ts";

const KV_UPSERT_QUERY = gql`
  mutation ($input: KeyValueUpsertInput!) {
    keyValueUpsert(input: $input) {
      keyValue {
        key
        value
      }
    }
  }
`;

interface KVUpsertResponse {
  keyValueUpsert: {
    keyValue: {
      key: string;
      value: string;
    };
  };
}

export async function upsertKV(
  key: string,
  value: string,
  accessToken: string,
  orgId: string
) {
  const resp = (await graphqlReq(
    KV_UPSERT_QUERY,
    {
      input: {
        sourceType: "org",
        key,
        value,
      },
    },
    {
      accessToken,
      orgId,
    }
  ).then((resp) => resp.json())) as GQLResponse<KVUpsertResponse>;

  if (resp?.errors?.length > 0) {
    throw resp.errors;
  }

  return resp?.data?.keyValueUpsert?.keyValue;
}

const KV_FETCH_QUERY = gql`
  query GetKeyValue($key: String!) {
    org {
      keyValue(input: { key: $key }) {
        key
        value
      }
    }
  }
`;

interface KVFetchResponse {
  org?: {
    keyValue?: {
      key: string;
      value: string;
    };
  };
}

export async function fetchKV(key: string, accessToken: string, orgId: string) {
  const resp = (await graphqlReq(
    KV_FETCH_QUERY,
    {
      key,
    },
    {
      accessToken,
      orgId,
    }
  ).then((resp) => resp.json())) as GQLResponse<KVFetchResponse>;

  if (resp?.errors?.length > 0) {
    throw resp.errors;
  }

  return resp?.data?.org?.keyValue;
}
