export function getBrowser(): string {
  if (!globalThis.window) return "unknown";

  // Firefox 1.0+
  const isFirefox = typeof InstallTrigger !== "undefined";

  // Safari 3.0+ "[object HTMLElementConstructor]"
  const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
    return p.toString() === "[object SafariRemoteNotification]";
  })(
    !window.safari ||
      (typeof safari !== "undefined" && window.safari.pushNotification),
  );

  // Internet Explorer 6-11
  const isIE = /* @cc_on!@ */ false || !!document.documentMode;

  // Edge 20+
  const isEdge = !isIE && !!window.StyleMedia;

  // Chrome 1 - 79
  const isChrome = !!window.chrome; // && (!!window.chrome.webstore || !!window.chrome.runtime)

  // Edge (based on chromium) detection
  const isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

  if (isChrome) return "chrome";
  if (isFirefox) return "firefox";
  if (isEdgeChromium) return "edge";
  if (isSafari) return "safari";
  if (isEdge) return "ie-edge";
  if (isIE) return "ie";

  return "unknown";
}
