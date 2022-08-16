// NOTE: this file should always be imported via 'https://tfl.dev/@truffle/global-context@^1.0.0/index.ts'

// this version on @truffle/context can change, but the resulting context needs to be backwards compatible
// DO NOT CHANGE THE MAJOR VERSION THIS PACKAGE
import Context from "https://tfl.dev/@truffle/context@^1.0.1/index.ts";

// we need to be very mindful of what gets stored in global context, because if we do it wrong,
// we're stuck with it forever.

// context current looks like { orgId, packageVersionId, router: { params }, packages: { ... } }
// context.packages is set with setPackageContext(packagePath, diff)
// eg. setPackageContext("@truffle/api@0", { client: makeClient() });
// which looks like context = { ..., packages { "@truffle/api@0": { client: ... } } }

const context = new Context();
export default context;
