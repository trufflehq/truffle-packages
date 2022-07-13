const CDN_URLS = {
  legacy: "https://fdn.uno/images",
  default: "https://cdn.bio/ugc",
  assets: "https://cdn.bio/assets",
};

export function getSrcByImageObj(imageObj, { size = "small" } = {}) {
  const { cdn, prefix, variations, ext = "jpg" } = imageObj || {};

  if (!prefix) {
    return "";
  }

  const postfix = `.${size}`;

  // check if variation exists
  const cdnKey = !cdn ? "legacy" : cdn;
  const hasVariation =
    (variations || []).find((variation) => variation.postfix === postfix) || (
      cdnKey === "legacy" && ext !== "svg" // legacy embedded imageObjs don't always have variations
    );

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
