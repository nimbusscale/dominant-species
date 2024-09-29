import { Pile } from './pile.model';

type ElementKind = 'grass' | 'grub';

interface Element {
  kind: ElementKind
}

function elementFactory(elementKind: ElementKind): Element {
  return {
    kind: elementKind
  }
}


describe('Pile', () => {
  let elementCountMap: Map<ElementKind, number>;

  beforeEach(() => {
    elementCountMap = new Map<ElementKind, number> (
      [
        ['grass', 10],
        ['grub', 10]
      ]
    )
  })


  it('should create an instance', () => {
    expect(new Pile<ElementKind, Element>(elementCountMap, elementFactory)).toBeTruthy();
  });
  describe('pull', () => {
    it('should pull one by default and reduce count by one', () => {
      const pile = new Pile<ElementKind, Element>(elementCountMap, elementFactory)
      const result = pile.pull()
      expect(result.length).toEqual(1)
      expect(pile.itemCounts.get(result[0].kind)).toEqual(9)
    })
    it('should can pull more than one and reduce count by that many', () => {
      const pile = new Pile<ElementKind, Element>(elementCountMap, elementFactory)
      const result = pile.pull(3)
      expect(result.length).toEqual(3)
      const kindPulledCount = new Map<ElementKind, number>
      for (let element of result) {
        const currentCount = kindPulledCount.get(element.kind) || 0
        kindPulledCount.set(element.kind, currentCount + 1)
      }
      kindPulledCount.forEach((value, key) => {
        expect(pile.itemCounts.get(key)).toEqual(10 - value)
      })

    })
  })

});
