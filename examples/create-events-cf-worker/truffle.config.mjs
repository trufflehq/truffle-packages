export default {
  name: "@truffle/create-events-cf-worker",
  version: "0.0.3",
  apiUrl: "https://mycelium.staging.bio/graphql",
  requestedPermissions: [
    {
      filters: { collectible: { isAll: true, rank: 0 } },
      action: "update",
      value: true,
    },
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
    {
      filters: { poll: { isAll: true, rank: 0 } },
      action: "update",
      value: true,
    },
    {
      filters: { poll: { isAll: true, rank: 0 } },
      action: "create",
      value: true,
    },
  ],
  installActionRel: {
    actionPath: "@truffle/core@latest/_Action/workflow",
    runtimeData: {
      mode: "sequential",
      stepActionRels: [
        {
          actionPath: "@truffle/core@latest/_Action/graphql",
          runtimeData: {
            query:
              "\n              mutation EventTopicUpsert ($input: EventTopicUpsertInput!) {\n                eventTopicUpsert(input: $input) {\n                  eventTopic {\n                    id\n                    orgId\n                    packageVersionId\n                    slug\n                  }\n                }\n              }",
            variables: {
              input: {
                slug: "viewer-create-poll-topic-cf",
              },
            },
          },
        },
        {
          actionPath: "@truffle/core@latest/_Action/graphql",
          runtimeData: {
            query:
              "\n              mutation CollectibleUpsert ($input: CollectibleUpsertInput!) {\n                collectibleUpsert(input: $input) {\n                  collectible {\n                    id\n                    name\n                    type\n                  }\n                }\n              }",
            variables: {
              input: {
                name: "Create a poll",
                slug: "viewer-create-poll-cf",
                type: "redeemable",
                data: {
                  redeemType: "event",
                  redeemButtonText: "Redeem",
                  redeemData: {
                    eventTopicSlug:
                      "viewer-create-poll-topic-cf",
                  },
                },
              },
            },
          },
        },
        {
          actionPath: "@truffle/core@latest/_Action/graphql",
          runtimeData: {
            query:
              "\n            mutation EventSubscriptionUpsert ($input: EventSubscriptionUpsertInput!) {\n              eventSubscriptionUpsert(input: $input) {\n                eventSubscription { id }\n              }\n            }",
            variables: {
              input: {
                eventTopicSlug:
                  "viewer-create-poll-topic-cf",
                actionRel: {
                  actionPath: "@truffle/core@1.0.0/_Action/webhook",
                  runtimeData: {
                    endpoint:
                      "https://create-events-cf-worker.truffle-tv.workers.dev",
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
}
