import {GameState} from "../engine/model/game-state.model";

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
        grassElement: 18,
        grubElement: 18,
        meatElement: 18,
        seedElement: 18,
        sunElement: 18,
        waterElement: 18,
      }
    }
  ]
}
