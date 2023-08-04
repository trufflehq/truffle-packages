export interface Perm<TParams = unknown> {
  action: string;
  params?: TParams;
}