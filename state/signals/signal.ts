import { observable } from "./deps.ts";

export function signal<T>(initialValue: T | Promise<T>) {
  return observable(
    initialValue,
  );
}
