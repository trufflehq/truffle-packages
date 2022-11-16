// here for syntax highlighting :)
const gql = (strings) => strings.join();

const ORG = "@truffle";
const PACKAGE = `${ORG}/do-something`;

export default {
  name: PACKAGE,
  version: "0.1.4",
  apiUrl: "https://mycelium.truffle.vip/graphql",
  description: "Let your audience control you through collectibles!",
  requestedPermissions: [
    {
      filters: {
        edgeFunction: { isAll: true, rank: 0 },
      },
      action: "update",
      value: true,
    },
    {
      filters: {
        edgeDeployment: { isAll: true, rank: 0 },
      },
      action: "update",
      value: true,
    },
    {
      filters: {
        eventTopic: { isAll: true, rank: 0 },
      },
      action: "update",
      value: true,
    },
    {
      filters: {
        action: { isAll: true, rank: 0 },
      },
      action: "create",
      value: true,
    },
    {
      filters: {
        action: { isAll: true, rank: 0 },
      },
      action: "update",
      value: true,
    },
    {
      filters: {
        eventSubscription: { isAll: true, rank: 0 },
      },
      action: "update",
      value: true,
    },
    {
      filters: {
        alert: { isAll: true, rank: 0 },
      },
      action: "create",
      value: true,
    },
  ],
  installActionRel: {
    // a workflow run a list of actions
    actionPath: "@truffle/core@latest/_Action/workflow",
    runtimeData: {
      mode: "sequential", // sequential | parallel
      stepActionRels: [
        {
          actionPath: "@truffle/core@latest/_Action/graphql",
          runtimeData: {
            query: gql`
              mutation RedeemEventTopicUpsert($input: EventTopicUpsertInput!) {
                eventTopicUpsert(input: $input) {
                  eventTopic {
                    id
                  }
                }
              }
            `,
            variables: {
              input: {
                resourcePath: `${PACKAGE}/_EventTopic/do-something-redeem`,
              },
            },
          },
        },
        {
          actionPath: "@truffle/core@latest/_Action/graphql",
          runtimeData: {
            query: gql`
              mutation ActionUpsert($input: ActionUpsertInput) {
                actionUpsert(input: $input) {
                  action {
                    id
                  }
                }
              }
            `,
            variables: {
              input: {
                type: "edgeFunction",
                name: "Create do something alert",
                description:
                  "Creates an alert that notifies the streamer to do something.",
                resourcePath: `${PACKAGE}/_Action/do-something-redeem`,
                config: {
                  edgeFunctionPath: `${PACKAGE}/_EdgeFunction/do-something-redeem:${ORG}`,
                },
              },
            },
          },
        },
        {
          actionPath: "@truffle/core@latest/_Action/graphql",
          runtimeData: {
            query: gql`
              mutation EventSubscriptionUpsert(
                $input: EventSubscriptionUpsertInput!
              ) {
                eventSubscriptionUpsert(input: $input) {
                  eventSubscription {
                    id
                  }
                }
              }
            `,
            variables: {
              input: {
                resourcePath: `${PACKAGE}/_EventSubscription/do-something-redeem`,
                actionRel: {
                  actionPath: `${PACKAGE}/_Action/do-something-redeem`,
                  runtimeData: {},
                },
                eventTopicPath: `${PACKAGE}/_EventTopic/do-something-redeem`,
              },
            },
          },
        },
      ],
    },
  },
  functions: [
    {
      slug: "do-something-redeem",
      description:
        "Creates an alert when someone redeems a 'do something' collectible.",
      entrypoint: "./functions/src/do-something-redeem.ts",
    },
  ],
};
