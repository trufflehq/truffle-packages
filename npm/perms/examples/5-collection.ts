import {
  PermissionsProcessor,
  permissionEvaluate,
  permission,
  permissionEvaluateTree,
  PermissionEvaluateFunc,
  DEFAULT_RESULT,
  PermissionEvaluateResult,
} from '../src';

interface Doc {
  id: string;
  name: string;
  content: string;
  collectionId: string;
}

interface Collection {
  id: string;
  name: string;
}

interface DocParams {
  docId: string;
}

interface DocContext {
  doc: Doc;
}

interface CollectionParams {
  collectionId: string;
}

interface CollectionContext {
  collection: Collection;
}

// function to check if a user can access a doc
const canAccessDoc: PermissionEvaluateFunc<DocParams, DocContext> = (permission, context) => {
  const resultIfMatch: PermissionEvaluateResult =
    permission.value === 'allow' ? { result: 'granted' } : { result: 'denied' };

  return permission.params?.docId === context.doc.id ? resultIfMatch : DEFAULT_RESULT;
};

// function to check if a user can access a collection
const canAccessCollection: PermissionEvaluateFunc<CollectionParams, CollectionContext> = (
  permission,
  context
) => {
  const resultIfMatch: PermissionEvaluateResult =
    permission.value === 'allow' ? { result: 'granted' } : { result: 'denied' };

  return permission.params?.collectionId === context.collection.id
    ? resultIfMatch
    : DEFAULT_RESULT;
};

const processor = new PermissionsProcessor();

// register our permissions tree
processor.register(
  permissionEvaluateTree({
    self: permissionEvaluate({
      action: 'collection.all',
      hasPermission: canAccessCollection,
    }),
    children: [
      {
        self: permissionEvaluate({ action: 'doc.all', hasPermission: canAccessDoc }),
        children: [
          {
            self: permissionEvaluate({
              action: 'collection.read',
              hasPermission: canAccessCollection,
            }),
            children: [
              {
                self: permissionEvaluate({
                  action: 'doc.read',
                  hasPermission: canAccessDoc,
                }),
              },
            ],
          },
          {
            self: permissionEvaluate({
              action: 'collection.write',
              hasPermission: canAccessCollection,
            }),
            children: [
              {
                self: permissionEvaluate({
                  action: 'doc.write',
                  hasPermission: canAccessDoc,
                }),
                children: [
                  {
                    self: permissionEvaluate({
                      action: 'collection.create',
                      hasPermission: canAccessCollection,
                    }),
                    children: [
                      {
                        self: permissionEvaluate({
                          action: 'doc.create',
                          hasPermission: canAccessDoc,
                        }),
                      },
                    ],
                  },
                  {
                    self: permissionEvaluate({
                      action: 'collection.update',
                      hasPermission: canAccessCollection,
                    }),
                    children: [
                      {
                        self: permissionEvaluate({
                          action: 'doc.update',
                          hasPermission: canAccessDoc,
                        }),
                      },
                    ],
                  },
                  {
                    self: permissionEvaluate({
                      action: 'collection.delete',
                      hasPermission: canAccessCollection,
                    }),
                    children: [
                      {
                        self: permissionEvaluate({
                          action: 'doc.delete',
                          hasPermission: canAccessDoc,
                        }),
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  })
);

// a doc and collection to test against
const doc: Doc = {
  id: '123',
  name: 'My cool doc',
  collectionId: '456',
  content: 'hello world',
};

const collection: Collection = {
  id: '456',
  name: 'My cool collection',
};

// the doc and collection make up our "context"
const context = { doc, collection };

// these are the permissions for three theoretical users
const user1Permissions = [
  permission({
    action: 'collection.all',
    value: 'allow',
    params: { collectionId: '456' },
  }),
];

const user2Permissions = [
  permission({ action: 'doc.read', value: 'allow', params: { docId: '456' } }),
];

const user3Permissions = [
  permission({ action: 'doc.all', value: 'allow', params: { docId: '123' } }),
];

console.log(
  'can user1 read doc "123" in collection "456"',
  processor.evaluate('doc.read', user1Permissions, context)
);

console.log(
  'can user2 read doc "123" in collection "456"',
  processor.evaluate('doc.read', user2Permissions, context)
);

console.log(
  'can user3 read doc "123" in collection "456"',
  processor.evaluate('doc.read', user3Permissions, context)
);

// output:
// can user1 read doc "123" in collection "456" true
// can user2 read doc "123" in collection "456" false
// can user3 read doc "123" in collection "456" true
