export function getIsNative() {
  // if we're on mobile we can guarantee it's native atm. don't want this to be hook
  // want it sync. if async, useDynamicTabs (and potentially other things) will break
  const isMobile = typeof navigator !== "undefined" &&
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  return isMobile;
}
