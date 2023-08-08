import {
  PermEvalFunc,
  PermsProcessor,
  defaultResult,
  perm,
  permEval,
} from '../src';

interface Doc {
  id: string;
  name: string;
  content: string;
}

interface DocParams {
  docId: string;
}

interface DocContext {
  doc: Doc;
}

// this is a custom permission evaluation function.
// custom functions take a perm and a context and return a boolean.
const canAccessDoc: PermEvalFunc<DocParams, DocContext> = (perm, context) => {
  return perm.params?.docId === context.doc.id
    ? { result: 'granted' }
    : defaultResult;
};

const processor = new PermsProcessor();

// register the custom function
processor.register(
  permEval({ action: 'doc.read', hasPermission: canAccessDoc })
);

// this is a doc that we want to check permissions on
const doc: Doc = {
  id: '123',
  name: 'My cool doc',
  content: 'hello world',
};

// these are the permissions for two theoretical users
const user1Perms = [
  perm({ action: 'doc.read', value: 'allow', params: { docId: '123' } }),
];
const user2Perms = [
  perm({ action: 'doc.read', value: 'allow', params: { docId: '321' } }),
];

console.log(
  'user1 doc.read doc 123',
  processor.evaluate('doc.read', user1Perms, { doc })
);

console.log(
  'user2 doc.read doc 123',
  processor.evaluate('doc.read', user2Perms, { doc })
);

// output:
// user1 doc.read doc 123 true
// user2 doc.read doc 123 false
