// putting this here until we fix declaration emission for the jumper package build

declare module '@trufflehq/jumper' {
  interface JumperConstructorOptions {
    timeout: number;
    handShakeTimeout: number;
    useSw: boolean;
    isParentValidFn: boolean;
  }

  export interface JumperCallParams {
    [key: string]: unknown;
  }
  export default class Jumper {
    constructor(options?: JumperConstructorOptions);

    setParent(parent: unknown): void;
    listen(): void;
    close(): void;
    call(method: string, params: JumperCallParams): void;
    onRequest(reply: unknown, request: unknown): void;
    onMessage(e: unknown, param: unknown): void;
    on(method: string, fn: (...params: any, { e: MessageEvent }) => void): void;
    on(
      method: string,
      fn: (
        ...params: any,
        onEmit: (...params: any) => any,
        { e: MessageEvent }
      ) => void
    ): void;
  }
}

// export as namespace '@trufflehq/jumper'

// export = Jumper
