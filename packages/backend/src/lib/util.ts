export function ensureDefined<T>(value: T | undefined): T {
  if (value === undefined) {
    throw new Error(`value not defined`);
  }
  return value;
}
