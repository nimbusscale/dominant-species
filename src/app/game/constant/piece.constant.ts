import { AnimalEnum } from './animal.constant';

export enum PieceKindEnum {
  ACTION_PAWN = 'actionPawn',
  ELEMENT = 'element',
  SPECIES = 'species',
  ACTION_PAWN_AMPHIBIAN = 'actionPawnAmphibian',
  ACTION_PAWN_ARACHNID = 'actionPawnArachnid',
  ACTION_PAWN_BIRD = 'actionPawnBird',
  ACTION_PAWN_INSECT = 'actionPawnInsect',
  ACTION_PAWN_MAMMAL = 'actionPawnMammal',
  ACTION_PAWN_REPTILE = 'actionPawnReptile',
  // Represents the lack of an Action Pawn in an action space.
  ACTION_PAWN_EYEBALL = 'actionPawnEyeball',
  SPECIES_AMPHIBIAN = 'speciesAmphibian',
  SPECIES_ARACHNID = 'speciesArachnid',
  SPECIES_BIRD = 'speciesBird',
  SPECIES_INSECT = 'speciesInsect',
  SPECIES_MAMMAL = 'speciesMammal',
  SPECIES_REPTILE = 'speciesReptile',
}

export type ActionPawnKind =
  | PieceKindEnum.ACTION_PAWN_AMPHIBIAN
  | PieceKindEnum.ACTION_PAWN_ARACHNID
  | PieceKindEnum.ACTION_PAWN_BIRD
  | PieceKindEnum.ACTION_PAWN_INSECT
  | PieceKindEnum.ACTION_PAWN_MAMMAL
  | PieceKindEnum.ACTION_PAWN_REPTILE
  | PieceKindEnum.ACTION_PAWN_EYEBALL;

export const animalByActionPawnKind: ReadonlyMap<string, string | null> = new Map<
  string,
  string | null
>([
  [PieceKindEnum.ACTION_PAWN_AMPHIBIAN, AnimalEnum.AMPHIBIAN],
  [PieceKindEnum.ACTION_PAWN_ARACHNID, AnimalEnum.ARACHNID],
  [PieceKindEnum.ACTION_PAWN_BIRD, AnimalEnum.BIRD],
  [PieceKindEnum.ACTION_PAWN_INSECT, AnimalEnum.INSECT],
  [PieceKindEnum.ACTION_PAWN_MAMMAL, AnimalEnum.MAMMAL],
  [PieceKindEnum.ACTION_PAWN_REPTILE, AnimalEnum.REPTILE],
  [PieceKindEnum.ACTION_PAWN_EYEBALL, null],
]);
