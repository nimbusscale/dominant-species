import {AreaIdEnum, SpaceKindEnum} from './area.constant';
import {PileIdEnum} from './pile.constant';
import {ElementEnum} from './element.constant';
import {deepFreeze} from "../../engine/util/misc";

export const ACTION_DISPLAY_ADAPTION_STATE = deepFreeze({
  id: AreaIdEnum.ACTION_DISPLAY_ADAPTION,
  space: [
    {kind: SpaceKindEnum.ELEMENT, piece: null},
    {kind: SpaceKindEnum.ELEMENT, piece: null},
    {kind: SpaceKindEnum.ELEMENT, piece: null},
    {kind: SpaceKindEnum.ELEMENT, piece: null},
    {kind: SpaceKindEnum.ACTION_PAWN, piece: null},
    {kind: SpaceKindEnum.ACTION_PAWN, piece: null},
    {kind: SpaceKindEnum.ACTION_PAWN, piece: null},
  ],
});

export const ELEMENT_DRAW_POOL_STATE = deepFreeze({
  id: PileIdEnum.ELEMENT,
  owner: null,
  inventory: {
    // 20 Elements each, with 2 being places on Earth, leaving 18 in the bag
    [ElementEnum.GRASS]: 18,
    [ElementEnum.GRUB]: 18,
    [ElementEnum.MEAT]: 18,
    [ElementEnum.SEED]: 18,
    [ElementEnum.SUN]: 18,
    [ElementEnum.WATER]: 18,
  },
})
