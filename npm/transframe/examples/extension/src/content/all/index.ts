import { createBackgroundScriptConsumer } from "@trufflehq/transframe/background-script";
import { createExporterClient } from "@fyko/export-api/client"

const consumer = createBackgroundScriptConsumer();

console.log('ima content script!')
consumer.call('sayHello', 'Bob').then(result => {
  console.log('result', result);
})

consumer.call('callbackTest', (result: string) => {
  console.log('result', result);
})