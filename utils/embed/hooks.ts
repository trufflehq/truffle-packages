import { useEffect, useState, jumper } from "./deps.ts";
import { ExtensionInfo } from './types.ts'

/**
 * This hook fetches extension info from the Truffle.TV browser extension on mount
 */
export function useExtensionInfo() {
  const [extensionInfo, setExtensionInfo] = useState<ExtensionInfo>();

  useEffect(() => {
    const fetchExtensionInfo = async () => {
      // grabs credentials from the extension so the embed knows the source of
      // where it's being injected
      const extensionInfo: ExtensionInfo | undefined = await jumper.call(
        "context.getInfo",
      );
      setExtensionInfo(extensionInfo);
    };

    fetchExtensionInfo();
  }, []);

  return { extensionInfo };
}
