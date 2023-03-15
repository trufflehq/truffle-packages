export interface GQLConnection<T> {
  nodes: T[];
}

export interface TruffleComponentRel {
  id: string;
  props: any;
}

export interface TrufflePowerup {
  id: string;
  slug: string;
  jsx: string;
  componentRels: TruffleComponentRel[];
}

export type TrufflePowerupConnection = GQLConnection<TrufflePowerup>;
