import globalContext from 'https://tfl.dev/@truffle/global-context@1.0.0/index.js'

export function getSsrReq () {
  const context = globalContext.getStore()
  if (context) return context.ssr?.req
}

export function setSsrReq (req) {
  const context = globalContext.getStore()
  if (context) {
    context.count = context.count || 0
    context.count += 1
    console.log('count...', context.count)
    context.ssr = context.ssr || {}
    context.ssr.req = req
  }
}

export function getSsrRes () {
  const context = globalContext.getStore()
  if (context) return context.ssr?.res
}

export function setSsrRes (res) {
  const context = globalContext.getStore()
  if (context) {
    context.count = context.count || 0
    context.count += 1
    console.log('count', context.count)
    context.ssr = context.ssr || {}
    context.ssr.res = res
  }
}
