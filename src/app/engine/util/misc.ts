/**
 * Used to determine if two objects are equal. Often used in distinctUntilChanged().
 */
export function deepCompare(object1: unknown, object2: unknown): boolean {
  return JSON.stringify(object1) === JSON.stringify(object2);
}

/**
 * Retrieves a value from a Map by its key, throwing an error if the key does not exist.
 *
 * @template K The type of the keys in the map.
 * @template V The type of the values in the map.
 * @param {Map<K, V>} map The map to retrieve the value from.
 * @param {K} key The key whose corresponding value is to be returned.
 * @param {string} [errorMessage] An optional custom error message to throw if the key is not found.
 *                                If not provided, a default message is used.
 * @returns {V} The value associated with the specified key in the map.
 * @throws {Error} If the key is not found in the map.
 */
export function getOrThrow<K, V>(
  map: Map<K, V> | ReadonlyMap<K, V>,
  key: K,
  errorMessage?: string,
): V {
  const value = map.get(key);
  if (value === undefined) {
    throw new Error(errorMessage ?? `Key "${String(key)}" not found in the map`);
  }
  return value;
}


export function ensureDefined<T>(value: T | undefined): T {
  if (value === undefined) {
    throw new Error(`${value} not defined`);
  }
  return value;
}
