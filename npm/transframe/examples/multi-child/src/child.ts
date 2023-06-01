import { createIframeConsumer } from "@trufflehq/transframe/iframe";
import { api as providerApi } from "./api";
import { println } from "./console";

const iframeConsumer = createIframeConsumer<typeof providerApi>({
  namespace: "truffle-site",
});

const api = iframeConsumer.api;

api.registerFrameCallback((message) => {
  println("A message just for meee!");
  println("It says: " + message);
});

api.registerGlobalCallback(() => {
  println("A message for everyone!");
});

const sayHelloButton = document.querySelector(
  "#say-hello-button"
) as HTMLButtonElement;
const getIdButton = document.querySelector(
  "#get-id-button"
) as HTMLButtonElement;
const throwErrorButton = document.querySelector(
  "#throw-error-button"
) as HTMLButtonElement;

sayHelloButton.addEventListener("click", async () => {
  const response = await api.sayHello();
  println(`From parent: ${response}`);
});

getIdButton.addEventListener("click", async () => {
  const response = await api.getId();
  println(`From parent: ${response}`);
});

throwErrorButton.addEventListener("click", async () => {
  try {
    await api.throwError();
  } catch (error) {
    println(`Error from parent: ${(error as any).message}`);
  }
});
