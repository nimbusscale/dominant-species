import { Pile, PileState } from '../../../app/engine/model/pile.model';
import { defaultPieceFactory } from '../../../app/engine/model/piece.model';

describe('Pile', () => {
  let pileState: PileState;
  let emptyPileState: PileState;
  let noInventoryPileState: PileState;
  let pile: Pile;

  beforeEach(() => {
    pileState = {
      id: 'test',
      inventory: {
        grass: 10,
        grub: 10,
      },
    };
    emptyPileState = {
      id: 'empty',
      inventory: {
        grass: 0,
        grub: 0,
      },
    };
    noInventoryPileState = {
      id: 'noInventory',
      inventory: {},
    };
    pile = new Pile(pileState, defaultPieceFactory);
  });

  describe('state', () => {
    it('should be able to retrieve a copy', () => {
      expect(pile.state).toEqual(pileState);
      expect(pile.state).not.toBe(pileState);
    });
    it('should be updatable', () => {
      const newPileState: PileState = {
        id: 'test',
        inventory: {
          meat: 1,
        },
      };
      pile.setState(newPileState);
      expect(pile.state).toEqual(newPileState);
    });
  });
  describe('length', () => {
    it('should return total number of items when pile has items', () => {
      const result = pile.length;
      expect(result).toEqual(20);
    });
    it('should return zero when pile has no items', () => {
      const pile = new Pile(noInventoryPileState, defaultPieceFactory);
      const result = pile.length;
      expect(result).toEqual(0);
    });
  });
  describe('pull', () => {
    it('should pull one by default and reduce count by one', () => {
      const result = pile.pull();
      expect(result.length).toEqual(1);
      if (result[0] !== null) {
        expect(result[0]).toBeTruthy();
        expect(pile.state.inventory[result[0].kind]).toEqual(9);
      } else {
        fail('Expected result[0] to be a valid Element, but got null');
      }
    });
    it('should can pull more than one and reduce count by that many', () => {
      const result = pile.pull(3);
      expect(result.length).toEqual(3);
      expect(result.every((item) => Boolean(item))).toBeTrue();
      const kindPulledCount = new Map<string, number>();
      for (const element of result) {
        if (element !== null) {
          const currentCount = kindPulledCount.get(element.kind) ?? 0;
          kindPulledCount.set(element.kind, currentCount + 1);
        }
      }
      kindPulledCount.forEach((value, key) => {
        expect(pile.state.inventory[key]).toEqual(10 - value);
      });
    });
    it('should return a null when drawing from a pile with no items', () => {
      const pile = new Pile(noInventoryPileState, defaultPieceFactory);
      const result = pile.pull();
      expect(result.length).toEqual(1);
      expect(result[0]).toBeNull();
    });
    it('should return a null when drawing from an empty pile', () => {
      const pile = new Pile(emptyPileState, defaultPieceFactory);
      const result = pile.pull();
      expect(result.length).toEqual(1);
      expect(result[0]).toBeNull();
      Object.keys(emptyPileState.inventory).forEach((key) => {
        expect(pile.state.inventory[key]).toEqual(0);
      });
    });
    it('should return a null for each pull where there is not an item', () => {
      const testPileState = {
        id: 'test',
        inventory: {
          grass: 1,
          grub: 0,
        },
      };
      const pile = new Pile(testPileState, defaultPieceFactory);
      const result = pile.pull(3);
      expect(result[0]).toBeTruthy();
      expect(result[1]).toBeNull();
      expect(result[2]).toBeNull();
    });
  });
  describe('putt', () => {
    it('should increase count of existing item', () => {
      pile.put([{ kind: 'grass' }]);
      expect(pile.state.inventory['grass']).toEqual(11);
      expect(pile.state.inventory['grub']).toEqual(10);
    });
    it('should be able to add more than one', () => {
      pile.put([{ kind: 'grass' }, { kind: 'grub' }]);
      expect(pile.state.inventory['grass']).toEqual(11);
      expect(pile.state.inventory['grub']).toEqual(11);
    });
    it('should be able to add new kind', () => {
      pile.put([{ kind: 'meat' }]);
      expect(pile.state.inventory['grass']).toEqual(10);
      expect(pile.state.inventory['grub']).toEqual(10);
      expect(pile.state.inventory['meat']).toEqual(1);
    });
  });
});
