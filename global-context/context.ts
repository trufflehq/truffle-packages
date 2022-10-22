// NOTE: this file should never be imported except from ./index.ts
// it's a separate file so we can ensure the browser only imports it once.
// otherwise with 302's, it could import it multiple times

// this version on @truffle/context can change, but the resulting context needs to be backwards compatible
// DO NOT CHANGE THE MAJOR VERSION THIS PACKAGE
import Context from "https://tfl.dev/@truffle/context@^1.0.0/index.ts";

// we need to be very mindful of what gets stored in global context, because if we do it wrong,
// we're stuck with it forever.

// context current looks like { orgId, packageVersionId, router: { params }, packages: { ... } }
// context.packages is set with setPackageContext(packagePath, diff)
// eg. setPackageContext("@truffle/api@0", { client: makeClient() });
// which looks like context = { ..., packages { "@truffle/api@0": { client: ... } } }

const context = new Context();
export default context;
