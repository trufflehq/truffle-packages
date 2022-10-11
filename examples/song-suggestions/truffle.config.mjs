export default {
  name: "@truffle/song-suggestions",
  version: "0.0.24",
  apiUrl: "https://mycelium.staging.bio/graphql",
  description: "Song Suggestions Suite",
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
    {
      filters: { action: { isAll: true, rank: 0 } },
      action: "update",
      value: true,
    },
    {
      filters: { orgUserCounter: { isAll: true, rank: 0 } },
      action: "update",
      value: true,
    }
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
            variables: { input: { slug: "song-submission-topic" } },
          },
        },
        {
          actionPath: "@truffle/core@latest/_Action/graphql",
          runtimeData: {
            query:
              "\n              mutation CollectibleUpsert ($input: CollectibleUpsertInput!) {\n                collectibleUpsert(input: $input) {\n                  collectible {\n                    id\n                    name\n                    type\n                  }\n                }\n              }",
            variables: {
              input: {
                name: "Playlist Song Submission",
                slug: "song-submission",
                type: "redeemable",
                data: {
                  redeemType: "event",
                  redeemButtonText: "Redeem",
                  redeemData: { eventTopicSlug: "song-submission-topic" },
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
                eventTopicSlug: "song-submission-topic",
                actionRel: {
                  actionPath: "@truffle/core@1.0.0/_Action/webhook",
                  runtimeData: {
                    endpoint:
                      "https://truffle-song-suggestion-lb.deno.dev/event/submission",
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
