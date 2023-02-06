import { TransframeConsumer, IframeConsumerInterface } from "@trufflehq/transframe";
import { api as backendApi } from "./api";
import { println } from "./console";

const iframeConsumer = new TransframeConsumer<typeof backendApi>(
  new IframeConsumerInterface()
);

const api = iframeConsumer.api;

api.registerFrameCallback((message) => {
  println('A message just for meee!');
  println('It says: ' + message);
})

api.registerGlobalCallback(() => {
  println('A message for everyone!')
})

const sayHelloButton = document.querySelector('#say-hello-button') as HTMLButtonElement;
const getIdButton = document.querySelector('#get-id-button') as HTMLButtonElement;

sayHelloButton.addEventListener('click', async () => {
  const response = await api.sayHello();
  println(`From parent: ${response}`);
});

getIdButton.addEventListener('click', async () => {
  const response = await api.getId();
  println(`From parent: ${response}`);
});
