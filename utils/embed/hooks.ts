import { jumper, useEffect, useSignal, useState } from "./deps.ts";
import { ExtensionInfo } from "./types.ts";

/**
 * This hook fetches extension info from the Truffle.TV browser extension on mount
 */
export function useExtensionInfo() {
  const [extensionInfo, setExtensionInfo] = useState<ExtensionInfo>();

  useEffect(() => {
    const fetchExtensionInfo = async () => {
      const extensionInfo: ExtensionInfo | undefined = await jumper.call(
        "context.getInfo",
      );
      setExtensionInfo(extensionInfo);
    };

    fetchExtensionInfo();
  }, []);

  return { extensionInfo };
}

/**
 * This hook fetches extension info from the Truffle.TV browser extension on mount and pulls it into a signal
 */
export function useExtensionInfo$() {
  const extensionInfo$ = useSignal(jumper.call("context.getInfo"));

  return extensionInfo$;
}
