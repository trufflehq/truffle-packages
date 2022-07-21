export default {
  name: "@dev/chessmaster",
  version: "0.6.3",
  apiUrl: "https://mycelium.staging.bio/graphql",
  requestedPermissions: [
    // permission to update a collectible
    {
      filters: { collectible: { isAll: true, rank: 0 } },
      action: "update",
      value: true,
    },
    // permission to update an event subscription
    {
      filters: { eventSubscription: { isAll: true, rank: 0 } },
      action: "update",
      value: true,
    },
    {
      filters: { eventTopic: { isAll: true, rank: 0 } },
      action: "update",
      value: true,
    },
    // permission to update a poll
    {
      filters: { poll: { isAll: true, rank: 0 } },
      action: "update",
      value: true,
    },
    // permission to create a poll
    {
      filters: { poll: { isAll: true, rank: 0 } },
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
        // This topic will be broadcasted when a user redeems the "Make move" collectible.
        // There will be a corresponding subscription that
        {
          actionPath: "@truffle/core@latest/_Action/graphql",
          runtimeData: {
            query: `
              mutation EventTopicUpsert ($input: EventTopicUpsertInput!) {
                eventTopicUpsert(input: $input) {
                  eventTopic {
                    id
                    orgId
                    packageVersionId
                    slug
                  }
                }
              }`,
            variables: {
              input: {
                slug: "chess-move-collectible-redeem-topic",
              },
            },
          },
        },
        {
          actionPath: "@truffle/core@latest/_Action/graphql",
          runtimeData: {
            query: `
              mutation EventSubscriptionUpsert ($input: EventSubscriptionUpsertInput!) {
                eventSubscriptionUpsert(input: $input) {
                  eventSubscription { id }
                }
              }`,
            variables: {
              input: {
                eventTopicSlug: "chess-move-collectible-redeem-topic",
                actionRel: {
                  actionPath: "@truffle/core@1.0.0/_Action/webhook",
                  runtimeData: {
                    endpoint:
                      "https://ucbwcygcelbeguaulgkz.functions.supabase.co/chessmaster-endpoint",
                  },
                },
              },
            },
          },
        },
        {
          actionPath: "@truffle/core@latest/_Action/graphql",
          runtimeData: {
            query: `
              mutation CollectibleUpsert ($input: CollectibleUpsertInput!) {
                collectibleUpsert(input: $input) {
                  collectible {
                    id
                    name
                    type
                  }
                }
              }`,
            variables: {
              input: {
                name: "Make a move",
                slug: "make-a-move",
                type: "redeemable",
                data: {
                  redeemType: "event",
                  redeemButtonText: "Redeem",
                  redeemData: {
                    eventTopicSlug: "chess-move-collectible-redeem-topic",
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};
