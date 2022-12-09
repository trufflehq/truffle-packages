import {
  getConnectionSourceType as getChannelSourceType,
  useComputed,
  useExtensionInfo$,
} from "../../deps.ts";

export function useSourcetype$() {
  const extensionInfo$ = useExtensionInfo$();
  const sourceType$ = useComputed(() => {
    const extensionInfo = extensionInfo$.get();
    return extensionInfo?.pageInfo
      ? getChannelSourceType(extensionInfo.pageInfo)
      : undefined;
  });

  return { sourceType$ };
}
