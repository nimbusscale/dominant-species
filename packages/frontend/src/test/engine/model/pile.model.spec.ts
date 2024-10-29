import { Pile, PileAdapter } from '../../../app/engine/model/pile.model';
import { defaultPieceFactory } from '../../../app/engine/model/piece.model';
import { Piece, PileState } from 'api-types/src/game-state';

describe('Pile', () => {
  let pileState: PileState;
  let emptyPileState: PileState;
  let noInventoryPileState: PileState;
  let pile: Pile;
  let grassPiece: Piece;
  let grubPiece: Piece;
  let meatPiece: Piece;

  beforeEach(() => {
    pileState = {
      id: 'test',
      owner: 'test',
      inventory: {
        grass: 10,
        grub: 10,
      },
    };
    emptyPileState = {
      id: 'empty',
      owner: 'test',
      inventory: {
        grass: 0,
        grub: 0,
      },
    };
    noInventoryPileState = {
      id: 'noInventory',
      owner: 'test',
      inventory: {},
    };
    pile = new Pile(pileState, defaultPieceFactory);

    grassPiece = defaultPieceFactory('grass');
    grubPiece = defaultPieceFactory('grub');
    meatPiece = defaultPieceFactory('meat');
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
      const result = pile.pullMany();
      expect(result.length).toEqual(1);
      if (result[0] !== null) {
        expect(result[0]).toBeTruthy();
        expect(pile.state.inventory[result[0].kind]).toEqual(9);
      } else {
        fail('Expected result[0] to be a valid Element, but got null');
      }
    });
    it('should can pull more than one and reduce count by that many', () => {
      const result = pile.pullMany(3);
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
      const result = pile.pullMany();
      expect(result.length).toEqual(1);
      expect(result[0]).toBeNull();
    });
    it('should return a null when drawing from an empty pile', () => {
      const pile = new Pile(emptyPileState, defaultPieceFactory);
      const result = pile.pullMany();
      expect(result.length).toEqual(1);
      expect(result[0]).toBeNull();
      Object.keys(emptyPileState.inventory).forEach((key) => {
        expect(pile.state.inventory[key]).toEqual(0);
      });
    });
    it('should return a null for each pull where there is not an item', () => {
      const testPileState = {
        id: 'test',
        owner: 'test',
        inventory: {
          grass: 1,
          grub: 0,
        },
      };
      const pile = new Pile(testPileState, defaultPieceFactory);
      const result = pile.pullMany(3);
      expect(result[0]).toBeTruthy();
      expect(result[1]).toBeNull();
      expect(result[2]).toBeNull();
    });
  });
  describe('putt', () => {
    it('should increase count of existing item', () => {
      pile.put([grassPiece]);
      expect(pile.state.inventory['grass']).toEqual(11);
      expect(pile.state.inventory['grub']).toEqual(10);
    });
    it('should be able to add more than one', () => {
      pile.put([grassPiece, grubPiece]);
      expect(pile.state.inventory['grass']).toEqual(11);
      expect(pile.state.inventory['grub']).toEqual(11);
    });
    it('should be able to add new kind', () => {
      pile.put([meatPiece]);
      expect(pile.state.inventory['grass']).toEqual(10);
      expect(pile.state.inventory['grub']).toEqual(10);
      expect(pile.state.inventory['meat']).toEqual(1);
    });
  });
});

interface TestPiece extends Piece {
  kind: string;
}

describe('PileAdapter', () => {
  let pileState: PileState;
  let pile: Pile;
  let pileAdapter: PileAdapter<TestPiece>;
  let testPiece: TestPiece | null;

  beforeEach(() => {
    pileState = {
      id: 'test',
      owner: 'test',
      inventory: {
        test: 10,
      },
    };
    pile = new Pile(pileState, defaultPieceFactory);
    pileAdapter = new PileAdapter<TestPiece>(pile);
  });
  it('should return item with TestPiece type', () => {
    testPiece = pileAdapter.pullOne();
    expect(testPiece).toBeTruthy();
  });
  it('should allow putting items with TestPiece type', () => {
    testPiece = defaultPieceFactory('test') as TestPiece;
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
      pileAdapter.put([testPiece as TestPiece]);
    }).not.toThrow();
  });
});
