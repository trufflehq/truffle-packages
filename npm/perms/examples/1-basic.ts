import { permission, PermissionsProcessor } from '../src';

const processor = new PermissionsProcessor();

// these are perms that a theoretical user has
const userPermissions = [
  permission('obj.read'),
  permission('obj.write'),
  // permission("obj.delete"),
];

// helper function to reduce boilerplate
const testPermission = (permission: string) => {
  console.log(permission, processor.evaluate(permission, userPermissions));
};

testPermission('obj.read');
testPermission('obj.write');
testPermission('obj.delete');

// output:
// obj.read true
// obj.write true
// obj.delete false
