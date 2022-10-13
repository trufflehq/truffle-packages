import { _, Observable } from "./deps.ts";

export function updateOnChange$<T extends object>(
  signal$: Observable<T>,
  value: T | undefined,
) {
  const currentValue = signal$.get() as T;

  if (value && !_.isEqual(value, currentValue)) {
    signal$.set(value);
  }
}
