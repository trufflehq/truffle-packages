const PATH_REGEX =
  /@(.*?)\/([^@]+)(?:@([0-9.]+|latest))(?:\/_([a-zA-Z]+))?(?:\/([^/]*))?$/i;

export type PathParts = {
  orgSlug: string;
  packageSlug: string;
  packageVersionSemver: string;
  modelName: string;
  slug: string;
  path: string;
};

export function getPathParts(path: string): PathParts | null {
  const [all, orgSlug, packageSlug, packageVersionSemver, modelName, slug] =
    path?.match(PATH_REGEX) || [];
  if (!all) {
    console.log("failed to parse", path);
  }
  return all
    ? { orgSlug, packageSlug, packageVersionSemver, modelName, slug, path }
    : null;
}
