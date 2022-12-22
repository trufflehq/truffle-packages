export type ActionBanner = {
  key?: string;
  Component: React.ReactNode;
};

export type ActionBannerMap = Record<string, ActionBanner>;
