export type NthParameter<T, N extends number> = T extends
  (...args: infer Args) => any ? Args[N] : never;
