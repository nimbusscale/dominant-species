import {AnimalEnum} from "./animal.constant";

export enum PileIdEnum {
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

export const pileIdsByAnimal: ReadonlyMap<string, Record<string, string>> = new Map<string, Record<string, string>>([
  [AnimalEnum.AMPHIBIAN, {actionPawn: PileIdEnum.ACTION_PAWN_AMPHIBIAN, species: PileIdEnum.SPECIES_AMPHIBIAN}],
  [AnimalEnum.ARACHNID, {actionPawn: PileIdEnum.ACTION_PAWN_ARACHNID, species: PileIdEnum.SPECIES_ARACHNID}],
  [AnimalEnum.BIRD, {actionPawn: PileIdEnum.ACTION_PAWN_BIRD, species: PileIdEnum.SPECIES_BIRD}],
  [AnimalEnum.INSECT, {actionPawn: PileIdEnum.ACTION_PAWN_INSECT, species: PileIdEnum.SPECIES_INSECT}],
  [AnimalEnum.MAMMAL, {actionPawn: PileIdEnum.ACTION_PAWN_MAMMAL, species: PileIdEnum.SPECIES_MAMMAL}],
  [AnimalEnum.REPTILE, {actionPawn: PileIdEnum.ACTION_PAWN_REPTILE, species: PileIdEnum.SPECIES_REPTILE}],
])
