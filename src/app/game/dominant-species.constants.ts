import { GameState } from '../engine/model/game-state.model';

export enum AnimalEnum {
  AMPHIBIAN = 'amphibian',
  ARACHNID = 'arachnid',
  BIRD = 'bird',
  INSECT = 'insect',
  MAMMAL = 'mammal',
  REPTILE = 'reptile',
}

export type AnimalKind = `${AnimalEnum}`;

export enum AreaIdEnum {
  ACTION_DISPLAY_ABUNDANCE = 'actionDisplayAbundance',
  ACTION_DISPLAY_ADAPTION = 'actionDisplayAdaption',
  AMPHIBIAN_ELEMENT = 'amphibianElement',
  ARACHNID_ELEMENT = 'arachnidElement',
  BIRD_ELEMENT = 'birdElement',
  INSECT_ELEMENT = 'insectElement',
  MAMMAL_ELEMENT = 'mammalElement',
  REPTILE_ELEMENT = 'reptileElement',
}

export type AreaId = `${AreaIdEnum}`;

export enum ElementEnum {
  GRASS = 'grassElement',
  GRUB = 'grubElement',
  MEAT = 'meatElement',
  SEED = 'seedElement',
  SUN = 'sunElement',
  WATER = 'waterElement',
}

export type ElementKind = `${ElementEnum}`;

export enum PieceKindEnum {
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

export type ActionPawnKind =
  | PieceKindEnum.ACTION_PAWN_AMPHIBIAN
  | PieceKindEnum.ACTION_PAWN_BIRD
  | PieceKindEnum.ACTION_PAWN_ARACHNID
  | PieceKindEnum.ACTION_PAWN_INSECT
  | PieceKindEnum.ACTION_PAWN_MAMMAL
  | PieceKindEnum.ACTION_PAWN_REPTILE;

export enum SpaceKindEnum {
  ACTION_PAWN = 'actionPawn',
  ELEMENT = 'element',
}

/**
 * GameState defining the static elements of the DS game
 */
export const baseGameState: GameState = {
  area: [
    {
      id: AreaIdEnum.ACTION_DISPLAY_ADAPTION as string,
      space: [
        { kind: SpaceKindEnum.ACTION_PAWN as string, piece: null },
        { kind: SpaceKindEnum.ACTION_PAWN as string, piece: null },
        { kind: SpaceKindEnum.ACTION_PAWN as string, piece: null },
      ],
    },
  ],
  faction: [],
  pile: [
    {
      id: PieceKindEnum.ELEMENT as string,
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

export interface ElementConfig {
  kind: ElementKind;
  inherentCount: number;
  areaId: AreaId;
}

export const elementConfigByAnimal = new Map<AnimalEnum, ElementConfig>([
  [
    AnimalEnum.AMPHIBIAN,
    { kind: ElementEnum.WATER, inherentCount: 3, areaId: AreaIdEnum.AMPHIBIAN_ELEMENT },
  ],
  [
    AnimalEnum.ARACHNID,
    { kind: ElementEnum.GRUB, inherentCount: 2, areaId: AreaIdEnum.ARACHNID_ELEMENT },
  ],
  [AnimalEnum.BIRD, { kind: ElementEnum.SEED, inherentCount: 2, areaId: AreaIdEnum.BIRD_ELEMENT }],
  [
    AnimalEnum.INSECT,
    { kind: ElementEnum.GRASS, inherentCount: 2, areaId: AreaIdEnum.INSECT_ELEMENT },
  ],
  [
    AnimalEnum.MAMMAL,
    { kind: ElementEnum.MEAT, inherentCount: 2, areaId: AreaIdEnum.MAMMAL_ELEMENT },
  ],
  [
    AnimalEnum.REPTILE,
    { kind: ElementEnum.SUN, inherentCount: 2, areaId: AreaIdEnum.REPTILE_ELEMENT },
  ],
] as const);
