export default {
  name: '@truffle/viewer-polls',
  version: '0.0.1',
  apiUrl: 'https://mycelium.staging.bio/graphql',
  requestedPermissions: [
    {
      filters: { collectible: { isAll: true, rank: 0 } },
      action: 'update', 
      value: true
    },
    {
      filters: { eventSubscription: { isAll: true, rank: 0 } },
      action: 'update',
      value: true
    },
    {
      filters: { eventTopic: { isAll: true, rank: 0 } },
      action: 'create',
      value: true
    },
    {
      filters: { poll: { isAll: true, rank: 0 } },
      action: 'update', 
      value: true
    },
    {
      filters: { poll: { isAll: true, rank: 0 } },
      action: 'create', 
      value: true
    },
  ],
  installActionRel: {
    actionPath: '@truffle/core@latest/_Action/workflow',
    runtimeData: {
      mode: 'sequential',
      stepActionRels:  [
        {
          actionPath: '@truffle/core@latest/_Action/graphql',
          runtimeData: {
            query: `
              mutation EventTopicCreate ($input: EventTopicCreateInput!) {
                eventTopicCreate(input: $input) {
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
                slug: 'viewer-create-poll'
              }
            }
          }
        },
        {
          actionPath: '@truffle/core@latest/_Action/graphql', // we grab action id from this. only used in this file, not stored in db
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
                name: 'Create a poll',
                slug: 'viewer-create-poll',
                type: 'redeemable',
                data: {
                  redeemType: 'event',
                  redeemButtonText: 'Redeem',
                  redeemData: {
                    eventTopicPath: '@truffle/viewer-polls@latest/_EventTopic/viewer-create-poll'
                  }
                }
              }
            }
          }
        },
        {
          actionPath: '@truffle/core@latest/_Action/graphql', // we grab @truffle/core action id from this. only used in this file, not stored in db
          runtimeData: {
            query: `
            mutation EventSubscriptionUpsert ($input: EventSubscriptionUpsertInput!) {
              eventSubscriptionUpsert(input: $input) {
                eventSubscription { id }
              }
            }`,
            variables: {
              input: {
                eventTopicPath: '@truffle/viewer-polls@latest/_EventTopic/viewer-create-poll',
                actionRel: {
                  actionPath: '@truffle/core@1.0.0/_Action/webhook',
                  runtimeData: {
                    endpoint: 'https://qvxhlnszjqwditgwritg.functions.supabase.co/viewer-polls-example-handler'
                  }
                }
              }
            }
          }
        }
      ]
    }
  }
}