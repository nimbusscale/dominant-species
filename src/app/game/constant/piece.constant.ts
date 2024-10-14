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
