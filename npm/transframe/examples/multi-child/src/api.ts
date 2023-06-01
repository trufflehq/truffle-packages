import { createIframeApi } from "@trufflehq/transframe/iframe";
import { println } from "./console";

type FrameCallback = (message: string) => void;

export const frameCallbackMap: Map<string, FrameCallback> = new Map();
export const globalCallbacks: Function[] = [];

export const api = createIframeApi({
  sayHello({ fromId }) {
    println(`Saying hello to ${fromId}!`);
    return `Hello!`;
  },
  getId({ fromId }) {
    return fromId;
  },
  registerFrameCallback({ fromId }, callback: FrameCallback) {
    // ignore if we don't have an id
    if (!fromId) return;

    println(`Registering frame callback for ${fromId}`);
    console.log("Registering callback", fromId, callback);
    frameCallbackMap.set(fromId, callback);
  },
  registerGlobalCallback({ fromId }, callback: FrameCallback) {
    println(`Registering global callback for ${fromId}`);
    globalCallbacks.push(callback);
  },
  throwError() {
    throw new Error("This is an error!");
  },
});
