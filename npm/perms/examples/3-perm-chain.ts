import { PermissionsProcessor, permissionEvaluate, permission, permissionEvaluateChain } from '../src';

const processor = new PermissionsProcessor();

processor.register(
  permissionEvaluateChain([
    permissionEvaluate('video.view'),
    permissionEvaluate('video.rename'),
    permissionEvaluate('video.delete'),
  ]),
);

const userPermissions = [permission('video.rename')];

const testPermission = (permission: string) => {
  console.log(permission, processor.evaluate(permission, userPermissions));
};

testPermission('video.view');
testPermission('video.rename');
testPermission('video.delete');

// output:
// video.view true
// video.rename true
// video.delete false
