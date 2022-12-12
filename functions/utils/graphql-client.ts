const MYCELIUM_API_URL = "https://mycelium.truffle.vip/graphql";

interface MyceliumOptions {
  accessToken: string;
  orgId: string;
  apiUrl: string;
}

export interface GQLResponse<T = unknown> {
  data: T;
  errors: unknown[];
}

export async function graphqlReq<T = unknown>(
  query: string,
  variables: Record<string, unknown>,
  options: MyceliumOptions,
) {
  const result = await fetch(options.apiUrl, {
    method: "POST",
    body: JSON.stringify({ query, variables }),
    headers: {
      "Content-Type": "application/json",
      "x-org-id": options.orgId,
      "x-access-token": options.accessToken,
    },
  });

  const resp = await result.json() as GQLResponse<T>;

  if (resp?.errors?.length > 0) {
    throw resp.errors;
  }

  return resp?.data;
}

export function gql(strings: TemplateStringsArray, ..._values: string[]) {
  return strings.join();
}

export class MyceliumClient {
  constructor(
    public accessToken: string,
    public orgId: string,
    public apiUrl = MYCELIUM_API_URL,
  ) {}

  query = <T = unknown>(
    queryStr: string,
    variables?: Record<string, unknown>,
  ) => {
    return graphqlReq<T>(queryStr, variables ?? {}, {
      accessToken: this.accessToken,
      orgId: this.orgId,
      apiUrl: this.apiUrl,
    });
  };
}
