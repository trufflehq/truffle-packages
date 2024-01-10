export interface PageInfo {
  title: string;
  url: string;
  site: string;
  contentPageType: string;
  contentPageOwnerRef: string;
  contentPageId: string;
  data: object;
}

export interface EnvironmentInfo {
  truffleVersion: string;
  isExperimental: boolean;
  isExperimentalSidebar: boolean;
  deviceType: 'desktop' | 'mobile';
}