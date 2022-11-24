export interface FileObj {
  prefix: string;
  cdn: string;
  ext: string;
  src: string;
  variations: ImageVariation[];
}

interface ImageVariation {
  width: number;
  height: number;
  postfix: string;
}
