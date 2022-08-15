import { Component } from "./mod.ts";

export interface ComponentInstance {
  id: string;
  props: Record<string, unknown>;
  sharedProps: Record<string, unknown>;
  parentId: string;
  treeSiblingIndex: number;
  treePath: string;
  rank: number;
  component?: Partial<Component>;
}
