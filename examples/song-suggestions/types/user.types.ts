export interface User {
  name?: string;
  avatarImage?: AvatarImage;
}

export interface AvatarImage {
  cdn: string
  prefix: string
  ext: string
  variations?: {
    postfix: string
    width: number
    height: number
  }
  aspectRatio?: number
}