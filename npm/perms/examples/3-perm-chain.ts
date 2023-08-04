import {
  PermsProcessor,
  permEval,
  perm,
  permEvalChain,
} from "../src";

const processor = new PermsProcessor();

processor.register(
  permEvalChain([
    permEval("video.view"),
    permEval("video.rename"),
    permEval("video.delete"),
  ])
);

const userPerms = [
  perm("video.rename"),
];

const testPerm = (perm: string) => {
  console.log(perm, processor.evaluate(perm, userPerms));
};

testPerm("video.view");
testPerm("video.rename");
testPerm("video.delete");


// output:
// video.view true
// video.rename true
// video.delete false
