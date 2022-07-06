export { resolveSeoStrategy };
export type { SeoStrategy };
declare type SeoStrategy = 'conservative' | 'google-speed';
declare function resolveSeoStrategy(options?: {
    seoStrategy?: SeoStrategy;
    userAgent?: string;
}): {
    disableStream: boolean;
};
