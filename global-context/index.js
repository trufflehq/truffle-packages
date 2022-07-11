// NOTE: this file should always be imported via 'https://tfl.dev/@truffle/global-context@1.0.0/index.js'

// this version on @truffle/context can change, but the resulting context needs to be backwards compatible
// DO NOT VERSION THIS FILE
import Context from 'https://tfl.dev/@truffle/context@1.0.0/index.js'

// we need to be very mindful of what gets stored in global context, because if we do it wrong,
// we're stuck with it forever.

// everything prefixed with an _ should only be accessed by either:
// 1) truffle-dev-server
// 2) the same packageVersion that set the context.
//      eg. if @truffle/api@semver sets _graphqlClient, only the api package should access it
// so we can change names / structure whenever we want

const context = new Context()
export default context
