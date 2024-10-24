export function isNull<T>(value: T | null): value is T {
  return value === null;
}

export function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

export function isNotUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function isTrue<T>(value: T | null): value is T {
  return value === true;
}

export function isFalse<T>(value: T | null): value is T {
  return value === false;
}
