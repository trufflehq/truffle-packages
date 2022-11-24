// NOTE: this file should always be imported via 'https://tfl.dev/@truffle/global-context@^1.0.0/index.ts'

export { default } from "./context.ts";

// we need to be very mindful of what gets stored in global context, because if we do it wrong,
// we're stuck with it forever.

// context current looks like { orgId, packageVersionId, router: { params }, packages: { ... } }
// context.packages is set with setPackageContext(packagePath, diff)
// eg. setPackageContext("@truffle/api@0", { client: makeClient() });
// which looks like context = { ..., packages { "@truffle/api@0": { client: ... } } }
