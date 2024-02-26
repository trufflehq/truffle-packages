import {
  PermissionsProcessor,
  permissionEvaluate,
  permission,
  permissionEvaluateTree,
} from "../src";

const processor = new PermissionsProcessor();

processor.register(
  permissionEvaluateTree({
    self: permissionEvaluate("doc.all"),
    children: [
      { self: permissionEvaluate("doc.read") },
      {
        self: permissionEvaluate("doc.write"),
        children: [
          { self: permissionEvaluate("doc.create") },
          { self: permissionEvaluate("doc.update") },
          { self: permissionEvaluate("doc.delete") },
        ],
      },
    ],
  })
);

const userPermissions = [
  // permission("doc.all"),
  permission("doc.write"),
  // permission("doc.create"),
  // permission("doc.delete"),
];

const testPermission = (permission: string) => {
  console.log(permission, processor.evaluate(permission, userPermissions));
};

testPermission("doc.read");
testPermission("doc.write");
testPermission("doc.create");
testPermission("doc.update");
testPermission("doc.delete");

// output:
// doc.read false
// doc.write true
// doc.create true
// doc.update true
// doc.delete true
