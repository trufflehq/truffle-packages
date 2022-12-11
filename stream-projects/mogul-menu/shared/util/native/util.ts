export function isNative() {
  return Boolean(window?.ReactNativeWebView);
}
