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

/**
 * Ensures that a given value is defined (i.e., not undefined).
 *
 * Typically used for values that start as undefined and then are set during initialization by a subscription.
 *
 * If the value is undefined, this function throws an error with a message
 * indicating that the value is not defined. If the value is defined, it is
 * returned unchanged.
 *
 * @template T - The type of the value being checked.
 * @param {T | undefined} value - The value to be checked.
 * @returns {T} - The value itself if it is defined.
 * @throws {Error} - Throws an error if the value is undefined.
 */
export function ensureDefined<T>(value: T | undefined): T {
  if (value === undefined) {
    throw new Error(`value not defined`);
  }
  return value;
}

/**
 * Returns the items that are in setA, but not in setB
 */
export function setDifference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set(Array.from(setA).filter((element) => !setB.has(element)));
}

/**
 * Returns a readonly version of an object.
 *
 * This is intended to be used with "seed" objects that should be copied to create a "read/write" object that can be used.
 */
export function deepFreeze<T>(obj: T): T {
  const propNames = Object.getOwnPropertyNames(obj) as (keyof T)[];
  for (const name of propNames) {
    const value = obj[name];
    if (typeof value === 'object' && value !== null) {
      deepFreeze(value);
    }
  }

  return Object.freeze(obj);
}
