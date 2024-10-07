import {deepCompare} from "../../app/engine/util";

describe('deepCompare', () => {
  it('returns true when two objects are equal', () => {
    const object1 = {
      key1: 'value1',
      key2: {
        subkey1: 'value1',
        subkey2: 'value2'
      }
    }
    const object2 = {
      key1: 'value1',
      key2: {
        subkey1: 'value1',
        subkey2: 'value2'
      }
    }
    expect(deepCompare(object1, object2)).toBe(true)
  })
  it('returns true when two objects are equal', () => {
    const object1 = {
      key1: 'value1',
      key2: {
        subkey1: 'value1',
        subkey2: 'value2'
      }
    }
    const object2 = {
      key1: 'value1',
      key2: {
        subkey1: 'value1',
        subkey2: 'value3'
      }
    }
    expect(deepCompare(object1, object2)).toBe(false)
  })

})
