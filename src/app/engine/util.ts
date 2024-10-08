/**
 * Used to determine if two objects are equal. Often used in distinctUntilChanged().
 */
export function deepCompare(object1: unknown, object2: unknown): boolean {
  return JSON.stringify(object1) === JSON.stringify(object2);
}
