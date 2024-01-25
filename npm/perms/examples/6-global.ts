import { Permission, PermissionsProcessor, permission, permissionEvaluate } from '../src';

const processor = new PermissionsProcessor();
processor.globalFallback = permissionEvaluate('superAdmin');

// these are perms that a theoretical user has
const userPermissions: Permission[] = [permission('superAdmin')];

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
// obj.delete true
