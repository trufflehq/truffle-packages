export { renderToStream };
export { disable };
import React from 'react';
import type { renderToPipeableStream as RenderToPipeableStream, renderToReadableStream as RenderToReadableStream } from 'react-dom/server';
import { Pipe } from './renderToStream/createPipeWrapper';
import { SeoStrategy } from './renderToStream/resolveSeoStrategy';
declare type Options = {
    webStream?: boolean;
    disable?: boolean;
    seoStrategy?: SeoStrategy;
    userAgent?: string;
    onBoundaryError?: (err: unknown) => void;
    renderToReadableStream?: typeof RenderToReadableStream;
    renderToPipeableStream?: typeof RenderToPipeableStream;
};
declare type Result = ({
    pipe: Pipe;
    readable: null;
} | {
    pipe: null;
    readable: ReadableStream;
}) & {
    streamEnd: Promise<boolean>;
    injectToStream: (chunk: string) => void;
};
declare function disable(): void;
declare function renderToStream(element: React.ReactNode, options?: Options): Promise<Result>;
