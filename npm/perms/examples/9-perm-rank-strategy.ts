import { PermsProcessor, permEval, perm, permEvalChain } from '../src';

const processor = new PermsProcessor();

processor.register(
  permEvalChain([
    permEval('prop.view'),
    permEval('doc.view'),
    permEval('coll.view'),
  ]),
);

const userPerms = [
  perm('coll.view'),
  perm({ action: 'prop.view', value: 'deny' }),
];

const testPerm = (perm: string) => {
  console.log(perm, processor.evaluate(perm, userPerms));
};

testPerm('prop.view');
testPerm('doc.view');
testPerm('coll.view');
