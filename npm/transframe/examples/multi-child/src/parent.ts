import { TransframeProvider, IframeProviderInterface } from '@trufflehq/transframe';
import { api, frameCallbackMap, globalCallbacks } from './api';

const iframeProvider = 
new TransframeProvider(
  new IframeProviderInterface(),
  { api }
);

const frames = [
  document.querySelector('#frame-1') as HTMLIFrameElement,
  document.querySelector('#frame-2') as HTMLIFrameElement,
  document.querySelector('#frame-3') as HTMLIFrameElement
];

const frameIds = frames.map((frame) => iframeProvider.registerFrame(frame))

function notifyFrame(idx: number) {
  const callback = frameCallbackMap.get(frameIds[idx]);
  if (!callback) return;
  callback(`Hi frame #${idx + 1}!`);
}

function notifyAll() {
  globalCallbacks.forEach((callback) => callback());
}

const notifyButtons = [
  document.querySelector('#notify-1-button') as HTMLButtonElement,
  document.querySelector('#notify-2-button') as HTMLButtonElement,
  document.querySelector('#notify-3-button') as HTMLButtonElement
]

notifyButtons.forEach((button, idx) => {
  button.addEventListener('click', () => {
    notifyFrame(idx);
  });
});

const notifyAllButton = document.querySelector('#notify-all-button') as HTMLButtonElement;
notifyAllButton.addEventListener('click', () => {
  notifyAll();
});