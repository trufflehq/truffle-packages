import { jumper, signal, useSelector } from "../../../deps.ts";

const extensionInfo$ = signal(jumper.call("context.getInfo"));

export function useIsNative() {
  const isNative = useSelector(() => {
    const info = extensionInfo$.get();

    return info?.platform === "native-ios" ||
      info?.platform === "native-android" ||
      Boolean(window?.ReactNativeWebView); // legacy (app version <= 1.0.3)
  });

  return isNative;
}
