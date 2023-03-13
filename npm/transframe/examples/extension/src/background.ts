import { createBackgroundScriptProvider, createBackgroundScriptApi } from '@trufflehq/transframe/background-script'

console.log('ima background script!')

createBackgroundScriptProvider({
  api: createBackgroundScriptApi({
    sayHello (_context, name: string) {
      console.log('saying hello to', name)
      return `Hello, ${name}!`
    },
    callbackTest(_context, callback: (result: string) => void) {
      console.log('background script registering callback')
      setTimeout(() => {
        console.log('background script calling callback')
        callback('hello from background script')
      }, 5000)
    }
  })
})

