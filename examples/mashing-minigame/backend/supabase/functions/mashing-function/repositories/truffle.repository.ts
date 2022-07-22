const TRUFFLE_API_URL = "https://mycelium.staging.bio/graphql";

export class TruffleRepository {
  private endpoint: string;

  constructor() {
    this.endpoint = TRUFFLE_API_URL;
  }

  fetch(query: string, variables: Record<string, unknown>, orgId?: string) {
    const headers = new Headers({
      "Authorization": `Bearer ${Deno.env.get("TRUFFLE_API_KEY")}`,
    });

    if (orgId) {
      headers.append("x-org-id", orgId);
    }
    return fetch(this.endpoint, {
      method: "POST",
      body: JSON.stringify({
        query,
        variables,
      }),
      headers,
    });
  }
}
