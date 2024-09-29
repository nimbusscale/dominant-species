import { Pile } from './pile.model';

type ElementKind = 'grass' | 'grub' | 'meat';

interface Element {
  kind: ElementKind;
}

function elementFactory(elementKind: ElementKind): Element {
  return {
    kind: elementKind,
  };
}

describe('Pile', () => {
  let elementCountMap: Map<ElementKind, number>;

  beforeEach(() => {
    elementCountMap = new Map<ElementKind, number>([
      ['grass', 10],
      ['grub', 10],
    ]);
  });

  it('should create an instance', () => {
    expect(new Pile<ElementKind, Element>(elementCountMap, elementFactory)).toBeTruthy();
  });
  describe('pull', () => {
    it('should pull one by default and reduce count by one', () => {
      const pile = new Pile<ElementKind, Element>(elementCountMap, elementFactory);
      const result = pile.pull();
      expect(result.length).toEqual(1);
      expect(result[0]).toBeTruthy();
      expect(pile.itemCounts.get(result[0]!.kind)).toEqual(9);
    });
    it('should can pull more than one and reduce count by that many', () => {
      const pile = new Pile<ElementKind, Element>(elementCountMap, elementFactory);
      const result = pile.pull(3);
      expect(result.length).toEqual(3);
      expect(result.every((item) => Boolean(item))).toBeTrue();
      const kindPulledCount = new Map<ElementKind, number>();
      for (const element of result) {
        const currentCount = kindPulledCount.get(element!.kind) ?? 0;
        kindPulledCount.set(element!.kind, currentCount + 1);
      }
      kindPulledCount.forEach((value, key) => {
        expect(pile.itemCounts.get(key)).toEqual(10 - value);
      });
    });
    it('should return a null when drawing from a pile with no items', () => {
      const emptyElementCountMap = new Map<ElementKind, number>();
      const pile = new Pile<ElementKind, Element>(emptyElementCountMap, elementFactory);
      const result = pile.pull();
      expect(result.length).toEqual(1);
      expect(result[0]).toBeNull();
    });
    it('should return a null when drawing from an empty pile', () => {
      const emptyElementCountMap = new Map<ElementKind, number>([
        ['grass', 0],
        ['grub', 0],
      ]);
      const pile = new Pile<ElementKind, Element>(emptyElementCountMap, elementFactory);
      const result = pile.pull();
      expect(result.length).toEqual(1);
      expect(result[0]).toBeNull();
      emptyElementCountMap.forEach((value, key) => {
        expect(pile.itemCounts.get(key)).toEqual(0);
      });
    });
    it('should return a null for each pull where there is not an item', () => {
      const emptyElementCountMap = new Map<ElementKind, number>([
        ['grass', 1],
        ['grub', 0],
      ]);
      const pile = new Pile<ElementKind, Element>(emptyElementCountMap, elementFactory);
      const result = pile.pull(3);
      expect(result[0]).toBeTruthy();
      expect(result[1]).toBeNull();
      expect(result[2]).toBeNull();
    });
  });
  describe('putt', () => {
    it('should increase count of existing item', () => {
      const pile = new Pile<ElementKind, Element>(elementCountMap, elementFactory);
      pile.put([{ kind: 'grass' }]);
      expect(pile.itemCounts.get('grass')).toEqual(11);
      expect(pile.itemCounts.get('grub')).toEqual(10);
    });
    it('should be able to add more than one', () => {
      const pile = new Pile<ElementKind, Element>(elementCountMap, elementFactory);
      pile.put([{ kind: 'grass' }, { kind: 'grub' }]);
      expect(pile.itemCounts.get('grass')).toEqual(11);
      expect(pile.itemCounts.get('grub')).toEqual(11);
    });
    it('should be able to add new kind', () => {
      const pile = new Pile<ElementKind, Element>(elementCountMap, elementFactory);
      pile.put([{ kind: 'meat' }]);
      expect(pile.itemCounts.get('grass')).toEqual(10);
      expect(pile.itemCounts.get('grub')).toEqual(10);
      expect(pile.itemCounts.get('meat')).toEqual(1);
    });
  });
});
