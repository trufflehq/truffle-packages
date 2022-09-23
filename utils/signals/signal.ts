import {
  observable,
  ObservableObjectOrArray,
  ObservablePrimitive,
} from "./deps.ts";

const mapPrimitives = new Map([
  ["boolean", true],
  ["string", true],
  ["number", true],
]);
export function isActualPrimitive(arg: any) {
  return mapPrimitives.has(typeof arg);
}
export function signal<T extends boolean>(
  initialValue: boolean | Promise<boolean>,
): ObservablePrimitive<boolean>;
export function signal<T extends string>(
  initialValue: string | Promise<string>,
): ObservablePrimitive<string>;
export function signal<T extends number>(
  initialValue: number | Promise<number>,
): ObservablePrimitive<number>;
export function signal<T extends object>(
  initialValue: T | Promise<T>,
): ObservableObjectOrArray<{ value: T }>;
export function signal<T extends unknown>(
  initialValue: T | Promise<T>,
): T extends object ? ObservableObjectOrArray<{ value: T }>
  : ObservablePrimitive<T>;
export function signal<T>(initialValue: T | Promise<T>) {
  return observable(
    isActualPrimitive(initialValue) ? initialValue : { value: initialValue },
  );
}
