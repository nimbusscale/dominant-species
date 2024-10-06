import { GameState } from '../engine/model/game-state.model';

export type dsPileKind =
  | 'element'
  | 'amphibianActionPawn'
  | 'amphibianSpecies'
  | 'arachnidActionPawn'
  | 'arachnidSpecies'
  | 'birdActionPawn'
  | 'birdSpecies'
  | 'insectActionPawn'
  | 'insectSpecies'
  | 'mammalActionPawn'
  | 'mammalSpecies'
  | 'reptileActionPawn'
  | 'reptileSpecies'

export enum DrawPileKindEnum {
  ELEMENT = 'element',

}

export enum dsPieceKind {
  ELEMENT = 'element',
  ACTION_PAWN_AMPHIBIAN = 'actionPawnAmphibian',
  ACTION_PAWN_ARACHNID = 'actionPawnArachnid'
}

/**
 * GameState defining the static elements of the DS game
 */
export const baseGameState: GameState = {
  faction: [],
  pile: [
    {
      kind: 'element',
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
