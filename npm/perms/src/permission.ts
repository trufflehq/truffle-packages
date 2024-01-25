export interface Permission<TParams = unknown> {
  action: string;
  value: "allow" | "deny";
  params?: TParams;
}
