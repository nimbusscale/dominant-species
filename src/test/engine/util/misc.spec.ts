import {deepCompare, ensureDefined, getOrThrow} from '../../../app/engine/util/misc';

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
    type TestType = {
      'test': string
    }
    const testValue: TestType = {test: 'test'}
    const result = ensureDefined(testValue)
    expect(result).toBe(testValue)
  })
  it('should throw an error if the value is undefined', () => {
    expect(() => ensureDefined(undefined)).toThrowError('undefined not defined');
  });

  it('should return null if null is passed, as it is considered a valid value', () => {
    const nullValue = null;
    expect(ensureDefined(nullValue)).toBe(nullValue);
  });
})
