import { GameState } from '../engine/model/game-state.model';

export enum DrawPileKind {
  ELEMENT = 'element',
}

/**
 * GameState defining the static elements of the DS game
 */
export const baseGameState: GameState = {
  faction: [],
  pile: [
    {
      kind: DrawPileKind.ELEMENT,
      inventory: {
        // 20 Elements each, with 2 being places on Earth, leaving 18 in the bag
        grassElement: 18,
        grubElement: 18,
        meatElement: 18,
        seedElement: 18,
        sunElement: 18,
        waterElement: 18,
      },
    },
  ],
};
