export function emit(el, name, options) {
  const e = new CustomEvent(name, {
    bubbles: true,
    cancelable: false,
    composed: true,
    detail: {},
    ...options,
  });
  el.dispatchEvent(e);
  return e;
}
