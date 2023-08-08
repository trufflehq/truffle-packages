import { Perm, PermsProcessor, perm, permEval } from '../src';

const processor = new PermsProcessor();
processor.globalFallback = permEval('superAdmin');

// these are perms that a theoretical user has
const userPerms: Perm[] = [perm('superAdmin')];

// helper function to reduce boilerplate
const testPerm = (perm: string) => {
  console.log(perm, processor.evaluate(perm, userPerms));
};

testPerm('obj.read');
testPerm('obj.write');
testPerm('obj.delete');

// output:
// obj.read true
// obj.write true
// obj.delete true
