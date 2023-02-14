const CDN_URLS = {
  legacy: 'https://fdn.uno/images',
  default: 'https://cdn.bio/ugc',
  assets: 'https://cdn.bio/assets',
};

export interface TruffleImage {
  cdn: keyof typeof CDN_URLS;
  prefix: string;
  ext: string;
  variations: {
    postfix: string;
    width: number;
    height: number;
  }[];
  aspectRatio: number;
}

type ImageSize = 'small' | 'medium' | 'large';

export function getSrcByImageObj(
  imageObj: TruffleImage,
  { size = 'small' }: { size?: ImageSize } = {}
) {
  const { cdn, prefix, variations, ext = 'jpg' } = imageObj || {};

  if (!prefix) {
    return '';
  }

  const postfix = `.${size}`;

  // check if variation exists
  const cdnKey = !cdn ? 'legacy' : cdn;
  const hasVariation =
    (variations || []).find((variation) => variation.postfix === postfix) ||
    (cdnKey === 'legacy' && ext !== 'svg'); // legacy embedded imageObjs don't always have variations

  const cdnUrl = CDN_URLS[cdnKey] || CDN_URLS.default;

  if (hasVariation) {
    return `${cdnUrl}/${prefix}${postfix}.${ext}`;
  } else {
    // if (['png', 'jpg'].includes(ext)) {
    //   // if this happens, we should make sure graphql is sending back variations
    //   // otherwise we might get stuck using large (5mb) versions of image
    //   console.log('missing variation', `${cdnUrl}/${prefix}.${ext}`)
    // }
    return `${cdnUrl}/${prefix}.${ext}`;
  }
}
