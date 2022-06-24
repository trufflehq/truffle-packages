export declare function isServerSide(): boolean;
export declare function isClientSide(): boolean;
export declare function assert(
  condition: unknown,
  debugInfo?: unknown,
): asserts condition;
export declare function assertUsage(
  condition: unknown,
  msg: string,
): asserts condition;
export declare function assertWarning(condition: unknown, msg: string): void;
import debug from "https://npm.tfl.dev/debug";
export declare function createDebugger(
  namespace: `react-streaming:${string}`,
  options?: {
    onlyWhenFocused?: true | string;
  },
): debug.Debugger["log"];
