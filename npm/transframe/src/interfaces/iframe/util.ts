/**
 * Creates a fake iframe element from a window object.
 * This is to be passed to TransframeProvider.registerFrame.
 */
export function fromWindow(_window: Window) {
  return { contentWindow: _window } as HTMLIFrameElement;
}