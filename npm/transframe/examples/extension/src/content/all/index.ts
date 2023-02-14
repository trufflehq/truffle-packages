import { createBackgroundScriptConsumerInterface } from "@trufflehq/transframe";

const consumer = createBackgroundScriptConsumerInterface();

consumer.call('sayHello', 'Bob').then(result => {
  console.log('result', result);
})

consumer.call('callbackTest', (result: string) => {
  console.log('result', result);
})