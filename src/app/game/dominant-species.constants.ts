import { GameState } from '../engine/model/game-state.model';

export enum dsPieceKind {
  ELEMENT = 'element',
  ACTION_PAWN_AMPHIBIAN = 'actionPawnAmphibian',
  ACTION_PAWN_ARACHNID = 'actionPawnArachnid',
  ACTION_PAWN_BIRD = 'actionPawnBird',
  ACTION_PAWN_INSECT = 'actionPawnInsect',
  ACTION_PAWN_MAMMAL = 'actionPawnMammal',
  ACTION_PAWN_REPTILE = 'actionPawnReptile',
  SPECIES_AMPHIBIAN = 'speciesAmphibian',
  SPECIES_ARACHNID = 'speciesArachnid',
  SPECIES_BIRD = 'speciesBird',
  SPECIES_INSECT = 'speciesInsect',
  SPECIES_MAMMAL = 'speciesMammal',
  SPECIES_REPTILE = 'speciesReptile',

}

/**
 * GameState defining the static elements of the DS game
 */
export const baseGameState: GameState = {
  faction: [],
  pile: [
    {
      kind: dsPieceKind.ELEMENT as string,
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
