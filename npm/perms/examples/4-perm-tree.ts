import {
  PermsProcessor,
  permEval,
  perm,
  permEvalTree,
} from "../src";

const processor = new PermsProcessor();

processor.register(
  permEvalTree({
    self: permEval("doc.all"),
    children: [
      { self: permEval("doc.read") },
      {
        self: permEval("doc.write"),
        children: [
          { self: permEval("doc.create") },
          { self: permEval("doc.update") },
          { self: permEval("doc.delete") },
        ],
      },
    ],
  })
);

const userPerms = [
  // perm("doc.all"),
  perm("doc.write"),
  // perm("doc.create"),
  // perm("doc.delete"),
];

const testPerm = (perm: string) => {
  console.log(perm, processor.evaluate(perm, userPerms));
};

testPerm("doc.read");
testPerm("doc.write");
testPerm("doc.create");
testPerm("doc.update");
testPerm("doc.delete");

// output:
// doc.read false
// doc.write true
// doc.create true
// doc.update true
// doc.delete true
