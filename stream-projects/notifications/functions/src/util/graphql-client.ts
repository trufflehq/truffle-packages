const MYCELIUM_API_URL = 'https://mycelium.staging.bio/graphql'

interface MyceliumOptions {
  apiKey?: string;
  orgId?: string;
}

// deno-lint-ignore no-explicit-any
export function graphqlReq(query: string, variables: Record<string, any>, options: MyceliumOptions) {

  return fetch(MYCELIUM_API_URL, {
    method: 'POST',
    body: JSON.stringify({ query, variables }),
    headers: {
      'Content-Type': 'application/json',
      'x-org-id': options.orgId ?? '',
      'Authorization': `Bearer ${options.apiKey}`
    },
  })
}

export function gql(strings: TemplateStringsArray, ..._values: string[]) {
  return strings.join()
}