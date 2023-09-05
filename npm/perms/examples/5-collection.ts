import {
  PermsProcessor,
  permEval,
  perm,
  permEvalTree,
  PermEvalFunc,
  DEFAULT_RESULT,
  PermEvalResult,
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
const canAccessDoc: PermEvalFunc<DocParams, DocContext> = (perm, context) => {
  const resultIfMatch: PermEvalResult =
    perm.value === 'allow' ? { result: 'granted' } : { result: 'denied' };

  return perm.params?.docId === context.doc.id ? resultIfMatch : DEFAULT_RESULT;
};

// function to check if a user can access a collection
const canAccessCollection: PermEvalFunc<CollectionParams, CollectionContext> = (
  perm,
  context
) => {
  const resultIfMatch: PermEvalResult =
    perm.value === 'allow' ? { result: 'granted' } : { result: 'denied' };

  return perm.params?.collectionId === context.collection.id
    ? resultIfMatch
    : DEFAULT_RESULT;
};

const processor = new PermsProcessor();

// register our permissions tree
processor.register(
  permEvalTree({
    self: permEval({
      action: 'collection.all',
      hasPermission: canAccessCollection,
    }),
    children: [
      {
        self: permEval({ action: 'doc.all', hasPermission: canAccessDoc }),
        children: [
          {
            self: permEval({
              action: 'collection.read',
              hasPermission: canAccessCollection,
            }),
            children: [
              {
                self: permEval({
                  action: 'doc.read',
                  hasPermission: canAccessDoc,
                }),
              },
            ],
          },
          {
            self: permEval({
              action: 'collection.write',
              hasPermission: canAccessCollection,
            }),
            children: [
              {
                self: permEval({
                  action: 'doc.write',
                  hasPermission: canAccessDoc,
                }),
                children: [
                  {
                    self: permEval({
                      action: 'collection.create',
                      hasPermission: canAccessCollection,
                    }),
                    children: [
                      {
                        self: permEval({
                          action: 'doc.create',
                          hasPermission: canAccessDoc,
                        }),
                      },
                    ],
                  },
                  {
                    self: permEval({
                      action: 'collection.update',
                      hasPermission: canAccessCollection,
                    }),
                    children: [
                      {
                        self: permEval({
                          action: 'doc.update',
                          hasPermission: canAccessDoc,
                        }),
                      },
                    ],
                  },
                  {
                    self: permEval({
                      action: 'collection.delete',
                      hasPermission: canAccessCollection,
                    }),
                    children: [
                      {
                        self: permEval({
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
const user1Perms = [
  perm({
    action: 'collection.all',
    value: 'allow',
    params: { collectionId: '456' },
  }),
];

const user2Perms = [
  perm({ action: 'doc.read', value: 'allow', params: { docId: '456' } }),
];

const user3Perms = [
  perm({ action: 'doc.all', value: 'allow', params: { docId: '123' } }),
];

console.log(
  'can user1 read doc "123" in collection "456"',
  processor.evaluate('doc.read', user1Perms, context)
);

console.log(
  'can user2 read doc "123" in collection "456"',
  processor.evaluate('doc.read', user2Perms, context)
);

console.log(
  'can user3 read doc "123" in collection "456"',
  processor.evaluate('doc.read', user3Perms, context)
);

// output:
// can user1 read doc "123" in collection "456" true
// can user2 read doc "123" in collection "456" false
// can user3 read doc "123" in collection "456" true
