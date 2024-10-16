import {AnimalEnum} from "./animal.constant";
import {PileIdEnum} from "./pile.constant";

export interface PileConfig {
  actionPawn: string,
  species: string
}


export const pileIdsByAnimal: ReadonlyMap<string, PileConfig> = new Map<
  string,
  PileConfig
>([
  [
    AnimalEnum.AMPHIBIAN,
    {actionPawn: PileIdEnum.ACTION_PAWN_AMPHIBIAN, species: PileIdEnum.SPECIES_AMPHIBIAN},
  ],
  [
    AnimalEnum.ARACHNID,
    {actionPawn: PileIdEnum.ACTION_PAWN_ARACHNID, species: PileIdEnum.SPECIES_ARACHNID},
  ],
  [AnimalEnum.BIRD, {actionPawn: PileIdEnum.ACTION_PAWN_BIRD, species: PileIdEnum.SPECIES_BIRD}],
  [
    AnimalEnum.INSECT,
    {actionPawn: PileIdEnum.ACTION_PAWN_INSECT, species: PileIdEnum.SPECIES_INSECT},
  ],
  [
    AnimalEnum.MAMMAL,
    {actionPawn: PileIdEnum.ACTION_PAWN_MAMMAL, species: PileIdEnum.SPECIES_MAMMAL},
  ],
  [
    AnimalEnum.REPTILE,
    {actionPawn: PileIdEnum.ACTION_PAWN_REPTILE, species: PileIdEnum.SPECIES_REPTILE},
  ],
]);
