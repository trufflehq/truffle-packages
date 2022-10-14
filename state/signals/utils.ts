import { _, Observable } from "./deps.ts";

/**
 * Update a signal only if the value has changed
 *
 * @param signal$ signal to update
 * @param value value to update the signal with
 */
export function updateOnChange$<T extends object>(
  signal$: Observable<T>,
  value: T | undefined,
) {
  const currentValue = signal$.get() as T;

  if (value && !_.isEqual(value, currentValue)) {
    signal$.set(value);
  }
}
