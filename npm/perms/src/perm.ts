export interface Perm<TParams = unknown> {
  action: string;
  value: 'allow' | 'deny';
  params?: TParams;
}