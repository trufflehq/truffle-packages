import { createBackgroundScriptProviderInterface, createProviderApi } from '@trufflehq/transframe'

console.log('ima background script!')

createBackgroundScriptProviderInterface({
  api: createProviderApi({
    sayHello (_fromId, name: string) {
      console.log('saying hello to', name)
      return `Hello, ${name}!`
    },
    callbackTest(_fromId, callback: (result: string) => void) {
      console.log('background script registering callback')
      setTimeout(() => {
        console.log('background script calling callback')
        callback('hello from background script')
      }, 5000)
    }
  })
})

