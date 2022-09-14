export function findFirst<T extends U, U>(coll: ReadonlyArray<T>, el: U[]) {
  const found = el.find((val) => includes(coll, val)) as T;

  return found;
}

export function includes<T extends U, U>(
  coll: ReadonlyArray<T>,
  el: U,
): el is T {
  return coll.includes(el as T);
}
