import {
  PermissionEvaluateFunc,
  PermissionsProcessor,
  DEFAULT_RESULT,
  permission,
  permissionEvaluate,
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
// custom functions take a permission and a context and return a boolean.
const canAccessDoc: PermissionEvaluateFunc<DocParams, DocContext> = (permission, context) => {
  return permission.params?.docId === context.doc.id
    ? { result: 'granted' }
    : DEFAULT_RESULT;
};

const processor = new PermissionsProcessor();

// register the custom function
processor.register(
  permissionEvaluate({ action: 'doc.read', hasPermission: canAccessDoc })
);

// this is a doc that we want to check permissions on
const doc: Doc = {
  id: '123',
  name: 'My cool doc',
  content: 'hello world',
};

// these are the permissions for two theoretical users
const user1Permissions = [
  permission({ action: 'doc.read', value: 'allow', params: { docId: '123' } }),
];
const user2Permissions = [
  permission({ action: 'doc.read', value: 'allow', params: { docId: '321' } }),
];

console.log(
  'user1 doc.read doc 123',
  processor.evaluate('doc.read', user1Permissions, { doc })
);

console.log(
  'user2 doc.read doc 123',
  processor.evaluate('doc.read', user2Permissions, { doc })
);

// output:
// user1 doc.read doc 123 true
// user2 doc.read doc 123 false
