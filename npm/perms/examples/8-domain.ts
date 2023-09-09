/**
 * This example produces the same output as 5-collection.ts, but uses "PermNamespaces"
 * to build the permissions graph.
 */

import {
  BasicModelPermEvalBuilderTree,
  perm,
  permEvalTree,
  PermNamespace,
  PermsProcessor,
} from "../src";

const collectionDomain = new PermNamespace("collection");
collectionDomain.registerActions(permEvalTree(BasicModelPermEvalBuilderTree()));

const docDomain = new PermNamespace("doc");
docDomain.registerActions(permEvalTree(BasicModelPermEvalBuilderTree()));

collectionDomain.registerChild(docDomain);

const permGraph = collectionDomain.generatePermGraph();
const processor = new PermsProcessor();
processor.register(permGraph);

// a doc and collection to test against
const doc = {
  id: "123",
  name: "My cool doc",
  collectionId: "456",
  content: "hello world",
};

const collection = {
  id: "456",
  name: "My cool collection",
};

// the doc and collection make up our "context"
const context = { doc, collection };

// these are the permissions for three theoretical users
const user1Perms = [
  perm({
    action: "collection.all",
    value: "allow",
    params: { match: { collection: { id: "456" } } },
  }),
];

const user2Perms = [
  perm({
    action: "doc.read",
    value: "allow",
    params: { match: { doc: { id: "456" } } },
  }),
];

const user3Perms = [
  perm({
    action: "doc.all",
    value: "allow",
    params: { match: { doc: { id: "123" } } },
  }),
];

const user4Perms = [
  perm({
    action: "doc.all",
    value: "allow",
    params: { match: { collection: { id: "456" }, doc: { id: "123" } } },
  }),
];

const user5Perms = [
  perm({
    action: "doc.all",
    value: "allow",
    params: { match: { collection: { id: "rando" }, doc: { id: "123" } } },
  }),
];

// true because user1 has access to doc "123"
console.log(
  'can user1 read doc "123" in collection "456"',
  processor.evaluate("doc.read", user1Perms, context),
);

// false because user only has access to doc "456"
console.log(
  'can user2 read doc "123" in collection "456"',
  processor.evaluate("doc.read", user2Perms, context),
);

// true because user3 has access to everything in collection 456
console.log(
  'can user3 read doc "123" in collection "456"',
  processor.evaluate("doc.read", user3Perms, context),
);

// true because user4 has access to doc "123" in collection "456"
console.log(
  'can user4 read doc "123" in collection "456"',
  processor.evaluate("doc.read", user4Perms, context),
);

// false because user5 has access to doc "123" in collection "rando" (wrong collection)
console.log(
  'can user5 read doc "123" in collection "456"',
  processor.evaluate("doc.read", user5Perms, context),
);
