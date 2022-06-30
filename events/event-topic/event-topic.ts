import {
  getPathParts,
  PathParts,
} from "https://tfl.dev/@truffle/utils@0.0.1/packages/path-parts.ts";

const EVENT_TOPIC_MODEL_NAME = "EventTopic";

export function isTargetEventTopicByPath(
  eventTopicPath: string,
  targetEventSlug: string,
) {
  const parts = getPathParts(eventTopicPath);

  if (!parts) return false;

  const { modelName, slug } = parts;
  return modelName === EVENT_TOPIC_MODEL_NAME && slug === targetEventSlug;
}

export function isTargetEventTopicByParts(
  pathParts: PathParts,
  targetEventSlug: string,
) {
  const { modelName, slug } = pathParts;
  return modelName === EVENT_TOPIC_MODEL_NAME && slug === targetEventSlug;
}
