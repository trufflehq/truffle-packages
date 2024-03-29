export default {
  name: "@truffle/viewer-polls",
  version: "0.2.4",
  // apiUrl: "https://mycelium.truffle.vip/graphql",
  apiUrl: "https://mycelium.staging.bio/graphql",
  description: "Stream Polls",

  // This is used to specify the required permissions that the package has access to
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
  // installActionRel specifies a workflow action that will run upon installation
  installActionRel: {
    // a workflow run a list of actions
    actionPath: "@truffle/core@latest/_Action/workflow",
    runtimeData: {
      mode: "sequential", // sequential | parallel
      stepActionRels: [
        // This action will create a custom event topic 'viewer-create-poll'
        // that will be broadcast when the collectible is redeemed. This is
        // used to forward an event to 3rd party services and packages
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
                slug: "viewer-polls-topic",
              },
            },
          },
        },
        // This action will create a collectible that users can redeem and will broadcast the custom
        // 'viewer-create-poll' event topic
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
                name: "Create a poll",
                slug: "viewer-poll",
                type: "redeemable",
                data: {
                  redeemType: "event",
                  redeemButtonText: "Redeem",
                  redeemData: {
                    eventTopicSlug: "viewer-polls-topic",
                  },
                },
              },
            },
          },
        },
        // This action will create an event subscription for a webhook to a 3rd party service
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
                // The event topic the subscription exists for
                eventTopicSlug: "viewer-polls-topic",
                actionRel: {
                  actionPath: "@truffle/core@1.0.0/_Action/webhook",
                  runtimeData: {
                    // The endpoint for the supabase edge function
                    endpoint:
                      "https://qvxhlnszjqwditgwritg.functions.supabase.co/viewer-polls-example-handler",
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
