import { FileObj } from "./file-obj.ts";

export interface User {
  id: string;
  name: string;
  avatarImage: FileObj;
}
