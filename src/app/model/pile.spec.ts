import { Pile, PileState } from './pile.model';

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
  let pileState: PileState<ElementKind>;
  let emptyPileState: PileState<ElementKind>;
  let noItemPileState: PileState<ElementKind>;

  beforeEach(() => {
    pileState = {
      grass: 10,
      grub: 10,
    };
    emptyPileState = {
      grass: 0,
      grub: 0,
    };
    noItemPileState = {};
  });

  it('should create an instance', () => {
    expect(new Pile<ElementKind, Element>(pileState, elementFactory)).toBeTruthy();
  });
  describe('state', () => {
    it('should be retrievable', () => {
      const pile = new Pile<ElementKind, Element>(pileState, elementFactory);
      expect(pile.state).toBe(pileState);
    });
    it('should be updatable', () => {
      const pile = new Pile<ElementKind, Element>(pileState, elementFactory);
      const newPileState: PileState<ElementKind> = {
        meat: 1,
      };
      pile.state = newPileState;
      expect(pile.state).toBe(newPileState);
    });
  });
  describe('length', () => {
    it('should return total number of items when pile has items', () => {
      const pile = new Pile<ElementKind, Element>(pileState, elementFactory);
      const result = pile.length;
      expect(result).toEqual(20);
    });
    it('should return zero when pile has no items', () => {
      const pile = new Pile<ElementKind, Element>(noItemPileState, elementFactory);
      const result = pile.length;
      expect(result).toEqual(0);
    });
  });
  describe('pull', () => {
    it('should pull one by default and reduce count by one', () => {
      const pile = new Pile<ElementKind, Element>(pileState, elementFactory);
      const result = pile.pull();
      expect(result.length).toEqual(1);
      if (result[0] !== null) {
        expect(result[0]).toBeTruthy();
        expect(pile.state[result[0].kind]).toEqual(9);
      } else {
        fail('Expected result[0] to be a valid Element, but got null');
      }
    });
    it('should can pull more than one and reduce count by that many', () => {
      const pile = new Pile<ElementKind, Element>(pileState, elementFactory);
      const result = pile.pull(3);
      expect(result.length).toEqual(3);
      expect(result.every((item) => Boolean(item))).toBeTrue();
      const kindPulledCount = new Map<ElementKind, number>();
      for (const element of result) {
        if (element !== null) {
          const currentCount = kindPulledCount.get(element.kind) ?? 0;
          kindPulledCount.set(element.kind, currentCount + 1);
        }
      }
      kindPulledCount.forEach((value, key) => {
        expect(pile.state[key]).toEqual(10 - value);
      });
    });
    it('should return a null when drawing from a pile with no items', () => {
      const pile = new Pile<ElementKind, Element>(noItemPileState, elementFactory);
      const result = pile.pull();
      expect(result.length).toEqual(1);
      expect(result[0]).toBeNull();
    });
    it('should return a null when drawing from an empty pile', () => {
      const pile = new Pile<ElementKind, Element>(emptyPileState, elementFactory);
      const result = pile.pull();
      expect(result.length).toEqual(1);
      expect(result[0]).toBeNull();
      Object.keys(emptyPileState).forEach((key) => {
        expect(pile.state[key as ElementKind]).toEqual(0);
      });
    });
    it('should return a null for each pull where there is not an item', () => {
      pileState = {
        grass: 1,
        grub: 0,
      };
      const pile = new Pile<ElementKind, Element>(pileState, elementFactory);
      const result = pile.pull(3);
      expect(result[0]).toBeTruthy();
      expect(result[1]).toBeNull();
      expect(result[2]).toBeNull();
    });
  });
  describe('putt', () => {
    it('should increase count of existing item', () => {
      const pile = new Pile<ElementKind, Element>(pileState, elementFactory);
      pile.put([{ kind: 'grass' }]);
      expect(pile.state.grass).toEqual(11);
      expect(pile.state.grub).toEqual(10);
    });
    it('should be able to add more than one', () => {
      const pile = new Pile<ElementKind, Element>(pileState, elementFactory);
      pile.put([{ kind: 'grass' }, { kind: 'grub' }]);
      expect(pile.state.grass).toEqual(11);
      expect(pile.state.grub).toEqual(11);
    });
    it('should be able to add new kind', () => {
      const pile = new Pile<ElementKind, Element>(pileState, elementFactory);
      pile.put([{ kind: 'meat' }]);
      expect(pile.state.grass).toEqual(10);
      expect(pile.state.grub).toEqual(10);
      expect(pile.state.meat).toEqual(1);
    });
  });
});
