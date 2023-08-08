import { perm, PermsProcessor } from "../src";

const processor = new PermsProcessor();

// these are perms that a theoretical user has
const userPerms = [
  perm("obj.read"),
  perm("obj.write"),
  perm({
    action: "obj.delete",
    value: "deny",
  }),
];

// helper function to reduce boilerplate
const testPerm = (perm: string) => {
  console.log(perm, processor.evaluate(perm, userPerms));
};

testPerm("obj.read");
testPerm("obj.write");
testPerm("obj.delete");

// output:
// obj.read true
// obj.write true
// obj.delete false
