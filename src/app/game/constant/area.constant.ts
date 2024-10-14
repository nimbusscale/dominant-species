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

export enum SpaceKindEnum {
  ACTION_PAWN = 'actionPawn',
  ELEMENT = 'element',
}
