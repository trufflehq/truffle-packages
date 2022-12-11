export interface FileRel {
  id: string;
  key: string;
  fileObj: File;
}

export type FileType = "image" | "video" | "other";

export interface File {
  id?: string;
  cdn?: string;
  data?: {
    name?: string;
    width?: number;
    height?: number;
    length?: number;
    aspectRatio?: number;
  };
  prefix?: string;
  contentType?: string;
  type?: FileType | string;
  variations?: any;
  ext?: string;
  signedUrl?: string;
}
