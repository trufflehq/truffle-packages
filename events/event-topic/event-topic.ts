import {
  getPathParts,
  PathParts,
} from "https://tfl.dev/@truffle/utils@0.0.1/packages/path-parts.ts";

export function isTargetEventTopicByPath(
  eventTopicPath: string,
  targetEventSlug: string,
) {
  const parts = getPathParts(eventTopicPath);

  if (!parts) return false;

  const { modelName, slug } = parts;
  return modelName === "EventTopic" && slug === targetEventSlug;
}

export function isTargetEventTopicByParts(
  pathParts: PathParts,
  targetEventSlug: string,
) {
  const { modelName, slug } = pathParts;
  return modelName === "EventTopic" && slug === targetEventSlug;
}
