// here for syntax highlighting :)
const gql = (strings) => strings.join();

// const PACKAGE = "@dev/notifications";
const PACKAGE = "@truffle/notifications";

export default {
  name: PACKAGE,
  version: "0.1.2",
  apiUrl: "https://mycelium.truffle.vip/graphql",

  // staging @dev settings
  // version: "0.5.16",
  // apiUrl: "https://mycelium.staging.bio/graphql",

  description: "Send notifications to your users when you go live.",
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
        route: { isAll: true, rank: 0 },
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
        eventCron: { isAll: true, rank: 0 },
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
        notificationTopic: { isAll: true, rank: 0 },
      },
      action: "create",
      value: true,
    },
    {
      filters: {
        notificationTopic: { isAll: true, rank: 0 },
      },
      action: "update",
      value: true,
    },
    {
      filters: {
        notificationJob: { isAll: true, rank: 0 },
      },
      action: "create",
      value: true,
    },
    {
      filters: {
        keyValue: { isAll: true, rank: 0 },
      },
      action: "update",
      value: true,
    },
  ],
  installActionRel: {
    // a workflow run a list of actions
    actionPath: "@truffle/core@latest/_Action/workflow",
    runtimeData: {
      mode: "sequential", // sequential | parallel
      // create event topic that will be broadcast an event every minute
      // to check if the streamer is live
      stepActionRels: [
        {
          actionPath: "@truffle/core@latest/_Action/graphql",
          runtimeData: {
            query: gql`
              mutation EventTopicUpsert($input: EventTopicUpsertInput!) {
                eventTopicUpsert(input: $input) {
                  eventTopic {
                    id
                  }
                }
              }
            `,
            variables: {
              input: {
                resourcePath: `${PACKAGE}/_EventTopic/notify-is-live`,
              },
            },
          },
        },
        // the event cron that will actually trigger the broadcast every minute
        {
          actionPath: "@truffle/core@latest/_Action/graphql",
          runtimeData: {
            query: gql`
              mutation EventCronUpsert($input: EventCronUpsertInput) {
                eventCronUpsert(input: $input) {
                  eventCron {
                    id
                    cronExpression
                  }
                }
              }
            `,
            variables: {
              input: {
                resourcePath: `${PACKAGE}/_EventCron/notify-is-live`,
                eventTopicPath: `${PACKAGE}/_EventTopic/notify-is-live`,
                cronExpression: "* * * * *",
              },
            },
          },
        },
        // the action to execute every minute
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
                name: "Notify isLive",
                description:
                  "Checks if a streamer is live and sends a notification to users if they are.",
                resourcePath: `${PACKAGE}/_Action/notify-is-live`,
                config: {
                  edgeFunctionPath:
                    "@truffle/notifications/_EdgeFunction/notify-is-live:@truffle",
                },
              },
            },
          },
        },
        // the event subscription to link event topic -> action;
        // it also provides the runtimeData which has the notificationContent
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
                resourcePath: `${PACKAGE}/_EventSubscription/notify-is-live`,
                actionRel: {
                  actionPath: `${PACKAGE}/_Action/notify-is-live`,
                  runtimeData: {
                    notificationJobUpsertInput: {
                      resourcePath: `${PACKAGE}/_NotificationJob`,
                      notificationTopicPath: `${PACKAGE}/_NotificationTopic/notify-is-live`,
                      content: {
                        title: "I'm live!",
                        body: "Go view my stream!",
                        icon: "https://cdn.bio/assets/images/branding/logomark.svg",
                      },
                    },
                  },
                },
                eventTopicPath: `${PACKAGE}/_EventTopic/notify-is-live`,
              },
            },
          },
        },
        // notification topic that users can subscribe to
        {
          actionPath: "@truffle/core@latest/_Action/graphql",
          runtimeData: {
            query: gql`
              mutation NotificationTopicUpsert(
                $input: NotificationTopicUpsertInput
              ) {
                notificationTopicUpsert(input: $input) {
                  notificationTopic {
                    id
                  }
                }
              }
            `,
            variables: {
              input: {
                resourcePath: `${PACKAGE}/_NotificationTopic/notify-is-live`,
                type: "public",
                name: "Going live",
                description: "Get notified when I go live.",
                notificationMediumSlug: "fcm",
              },
            },
          },
        },
      ],
    },
  },
  functions: [
    {
      slug: "notify-is-live",
      description: "Sends a notification to users if the streamer is live.",
      entrypoint: "./functions/src/notify-is-live.ts",
    },
  ],
};
