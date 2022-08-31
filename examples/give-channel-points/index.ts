const TRUFFLE_API_URL = "https://mycelium.staging.bio/graphql";
const ORG_SLUG = "early-access-rydan";
// for now you can grab this from click on a user here: https://staging.bio/org/early-access-rydan/admin/users
// and scrolling to "User ID:"
const USER_ID = "b969af10-ba6f-11ec-a814-a4b670a447bc"; // austin's userId
const INCREMENT_COUNT = 5;

const ORG_QUERY = `
  query($input: OrgInput) {
    org(input: $input) {
      id
    }
  }
`;

const CP_ORG_USER_COUNTER_TYPE_QUERY = `
  query {
    orgUserCounterType(input: { slug: "channel-points" }) {
      id
    }
  }
`;

const CP_ORG_USER_COUNTER_QUERY = `
  query($input: OrgUserCounterInput) {
    orgUserCounter(input: $input) {
      count
    }
  }
`;

const CP_ORG_USER_COUNTER_INCREMENT_MUTATION = `
  mutation($input: OrgUserCounterIncrementInput!) {
    orgUserCounterIncrement(input: $input) {
      isUpdated
    }
  }
`;

async function truffleReq({ query, variables, orgId }: {
  query: string;
  variables?: Record<string, unknown>;
  orgId?: string;
}) {
  const headers = new Headers({
    "Authorization": `Bearer ${Deno.env.get("TRUFFLE_API_KEY")}`,
  });

  if (orgId) {
    headers.append("x-org-id", orgId);
  }
  const res = await fetch(TRUFFLE_API_URL, {
    method: "POST",
    body: JSON.stringify({
      query,
      variables,
    }),
    headers,
  });
  return res.json();
}

async function giveChannelPoints() {
  // grab the org (eg a specific creator's "database")
  const orgResponse = await truffleReq({
    query: ORG_QUERY,
    variables: { input: { slug: ORG_SLUG } },
  });
  console.log("org", orgResponse);
  const orgId = orgResponse.data.org.id;

  // grab the counter type for channel points
  const orgUserCounterTypeResponse = await truffleReq({
    query: CP_ORG_USER_COUNTER_TYPE_QUERY,
    orgId,
  });
  console.log("orgUserCounterType", orgUserCounterTypeResponse);
  const orgUserCounterTypeId =
    orgUserCounterTypeResponse.data.orgUserCounterType.id;

  // grab the counter for USER_ID and channel points counter type
  const orgUserCounterResponse = await truffleReq({
    query: CP_ORG_USER_COUNTER_QUERY,
    variables: {
      input: {
        orgUserCounterTypeId,
        userId: USER_ID,
      },
    },
    orgId,
  });
  console.log("orgUserCounter", orgUserCounterResponse); // use to see how many points they currently have, if needed

  // increment the counter
  const orgUserCounterIncrementResponse = await truffleReq({
    query: CP_ORG_USER_COUNTER_INCREMENT_MUTATION,
    variables: {
      input: {
        orgUserCounterTypeId,
        userId: USER_ID,
        count: INCREMENT_COUNT,
      },
    },
    orgId,
  });
  console.log("mutation response", orgUserCounterIncrementResponse);
}

giveChannelPoints();
