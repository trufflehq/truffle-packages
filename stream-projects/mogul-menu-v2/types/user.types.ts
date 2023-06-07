import { ConnectionSourceType } from "../deps.ts";

export interface User {
  id?: string;
  name?: string;
  avatarImage?: AvatarImage;
}

export interface AvatarImage {
  cdn: string;
  prefix: string;
  ext: string;
  variations?: {
    postfix: string;
    width: number;
    height: number;
  };
  aspectRatio?: number;
}

export interface MeUser {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  avatarImage: AvatarImage;
}

export interface MeUserWithConnectionConnection extends Omit<MeUser, "user"> {
  connectionConnection: {
    nodes: {
      id: string;
      sourceType: ConnectionSourceType;
      sourceId: string;
      orgId: string;
    }[];
  };
}
