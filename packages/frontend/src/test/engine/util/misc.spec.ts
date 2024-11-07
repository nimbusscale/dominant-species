import { deepCompare, deepFreeze, ensureDefined, getOrThrow } from '../../../app/engine/util/misc';

describe('deepCompare', () => {
  it('returns true when two objects are equal', () => {
    const object1 = {
      key1: 'value1',
      key2: {
        subkey1: 'value1',
        subkey2: 'value2',
      },
    };
    const object2 = {
      key1: 'value1',
      key2: {
        subkey1: 'value1',
        subkey2: 'value2',
      },
    };
    expect(deepCompare(object1, object2)).toBe(true);
  });
  it('returns true when two objects are equal', () => {
    const object1 = {
      key1: 'value1',
      key2: {
        subkey1: 'value1',
        subkey2: 'value2',
      },
    };
    const object2 = {
      key1: 'value1',
      key2: {
        subkey1: 'value1',
        subkey2: 'value3',
      },
    };
    expect(deepCompare(object1, object2)).toBe(false);
  });
});

describe('getOrThrow', () => {
  let testMap: Map<string, number>;

  beforeEach(() => {
    // Initialize the test map with some values
    testMap = new Map<string, number>([
      ['apple', 1],
      ['banana', 2],
      ['cherry', 3],
    ]);
  });

  it('should return the value when the key exists in the map', () => {
    const result = getOrThrow(testMap, 'apple');
    expect(result).toBe(1);
  });

  it('should throw an error when the key does not exist in the map', () => {
    expect(() => getOrThrow(testMap, 'orange')).toThrowError();
  });

  it('should throw a custom error message if provided and the key does not exist', () => {
    expect(() => getOrThrow(testMap, 'orange', 'Custom error message')).toThrowError(
      'Custom error message',
    );
  });

  it('should not throw an error for keys with falsy values if they exist in the map', () => {
    // Add a key with a falsy value (e.g., 0)
    testMap.set('zeroValue', 0);
    const result = getOrThrow(testMap, 'zeroValue');
    expect(result).toBe(0);
  });
});

describe('ensureDefined', () => {
  it('returns value as type when value is defined', () => {
    interface TestType {
      test: string;
    }
    const testValue: TestType = { test: 'test' };
    const result = ensureDefined(testValue);
    expect(result).toBe(testValue);
  });
  it('should throw an error if the value is undefined', () => {
    expect(() => {
      ensureDefined(undefined);
    }).toThrowError();
  });

  it('should return null if null is passed, as it is considered a valid value', () => {
    const nullValue = null;
    expect(ensureDefined(nullValue)).toBe(nullValue);
  });
});

describe('deepFreeze', () => {
  it('should return the object itself', () => {
    const obj = { a: 1 };
    const frozenObj = deepFreeze(obj);
    expect(frozenObj).toBe(obj);
  });

  it('should freeze the top-level properties of an object', () => {
    const obj = { a: 1, b: 'test' };
    deepFreeze(obj);

    expect(Object.isFrozen(obj)).toBeTrue();
    expect(() => {
      obj.a = 2;
    }).toThrowError(TypeError);
    expect(() => {
      obj.b = 'changed';
    }).toThrowError(TypeError);
  });

  it('should freeze nested objects', () => {
    const obj = { a: { b: 2 } };
    deepFreeze(obj);

    expect(Object.isFrozen(obj)).toBeTrue();
    expect(Object.isFrozen(obj.a)).toBeTrue();
    expect(() => {
      obj.a.b = 3;
    }).toThrowError(TypeError);
  });

  it('should freeze deeply nested objects', () => {
    const obj = { a: { b: { c: { d: 4 } } } };
    deepFreeze(obj);

    expect(Object.isFrozen(obj.a)).toBeTrue();
    expect(Object.isFrozen(obj.a.b)).toBeTrue();
    expect(Object.isFrozen(obj.a.b.c)).toBeTrue();
    expect(Object.isFrozen(obj.a.b.c.d)).toBeTrue(); // Even primitive properties should not be modified
    expect(() => {
      obj.a.b.c.d = 5;
    }).toThrowError(TypeError);
  });

  it('should not freeze null properties', () => {
    const obj = { a: null };
    deepFreeze(obj);

    expect(Object.isFrozen(obj)).toBeTrue();
    expect(obj.a).toBeNull();
  });

  it('should handle objects with arrays correctly', () => {
    const obj = { a: [1, 2, 3] };
    deepFreeze(obj);

    expect(Object.isFrozen(obj)).toBeTrue();
    expect(Object.isFrozen(obj.a)).toBeTrue();
    expect(() => {
      obj.a[0] = 4;
    }).toThrowError(TypeError);
  });

  it('should not freeze primitive values directly', () => {
    const primitiveNumber = 5;
    const frozenPrimitive = deepFreeze(primitiveNumber);

    expect(frozenPrimitive).toBe(5); // The primitive itself remains unchanged
  });
});
