import { FileObj } from "./file-obj.ts";

export interface Collectible {
  id: string;
  name: string;
  fileRel: {
    fileObj: FileObj;
  };
}
