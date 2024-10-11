import { GameState } from '../engine/model/game-state.model';

export enum dsAnimal {
  AMPHIBIAN = 'amphibian',
  ARACHNID = 'arachnid',
  BIRD = 'bird',
  INSECT = 'insect',
  MAMMAL = 'mammal',
  REPTILE = 'reptile',
}

export enum dsAreaId {
  ACTION_DISPLAY_ABUNDANCE = 'actionDisplayAbundance',
  ACTION_DISPLAY_ADAPTION = 'actionDisplayAdaption',
  AMPHIBIAN_ELEMENT = 'amphibianElement',
  ARACHNID_ELEMENT = 'arachnidElement',
  BIRD_ELEMENT = 'birdElement',
  INSECT_ELEMENT = 'insectElement',
  MAMMAL_ELEMENT = 'mammalElement',
  REPTILE_ELEMENT = 'reptileElement',
}

export enum dsElement {
  GRASS = 'grassElement',
  GRUB = 'grubElement',
  MEAT = 'meatElement',
  SEED = 'seedElement',
  SUN = 'sunElement',
  WATER = 'waterElement',
}

export enum dsPieceKind {
  ACTION_PAWN_AMPHIBIAN = 'actionPawnAmphibian',
  ACTION_PAWN_ARACHNID = 'actionPawnArachnid',
  ACTION_PAWN_BIRD = 'actionPawnBird',
  ACTION_PAWN_INSECT = 'actionPawnInsect',
  ACTION_PAWN_MAMMAL = 'actionPawnMammal',
  ACTION_PAWN_REPTILE = 'actionPawnReptile',
  ELEMENT = 'element',
  SPECIES_AMPHIBIAN = 'speciesAmphibian',
  SPECIES_ARACHNID = 'speciesArachnid',
  SPECIES_BIRD = 'speciesBird',
  SPECIES_INSECT = 'speciesInsect',
  SPECIES_MAMMAL = 'speciesMammal',
  SPECIES_REPTILE = 'speciesReptile',
}

export enum dsSpaceKind {
  ACTION_PAWN = 'actionPawn',
  ELEMENT = 'element',
}

/**
 * GameState defining the static elements of the DS game
 */
export const baseGameState: GameState = {
  area: [
    {
      id: dsAreaId.ACTION_DISPLAY_ADAPTION as string,
      space: [
        { kind: dsSpaceKind.ACTION_PAWN as string, piece: null },
        { kind: dsSpaceKind.ACTION_PAWN as string, piece: null },
        { kind: dsSpaceKind.ACTION_PAWN as string, piece: null },
      ],
    },
  ],
  faction: [],
  pile: [
    {
      id: dsPieceKind.ELEMENT as string,
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

export const inherentElementKindByAnimal = new Map<dsAnimal, { kind: dsElement; inherent: number }>(
  [
    [dsAnimal.AMPHIBIAN, { kind: dsElement.WATER, inherent: 3 }],
    [dsAnimal.ARACHNID, { kind: dsElement.GRUB, inherent: 2 }],
    [dsAnimal.BIRD, { kind: dsElement.SEED, inherent: 2 }],
    [dsAnimal.INSECT, { kind: dsElement.GRASS, inherent: 2 }],
    [dsAnimal.MAMMAL, { kind: dsElement.MEAT, inherent: 2 }],
    [dsAnimal.REPTILE, { kind: dsElement.SUN, inherent: 2 }],
  ] as const,
);
