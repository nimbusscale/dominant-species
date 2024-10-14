import { GameState } from '../../engine/model/game-state.model';
import { AreaIdEnum, SpaceKindEnum } from './area.constant';
import {PileIdEnum} from "./pile.constant";

/**
 * GameState defining the static elements of the DS game
 */
export const baseGameState: GameState = {
  area: [
    {
      id: AreaIdEnum.ACTION_DISPLAY_ADAPTION,
      space: [
        { kind: SpaceKindEnum.ACTION_PAWN, piece: null },
        { kind: SpaceKindEnum.ACTION_PAWN, piece: null },
        { kind: SpaceKindEnum.ACTION_PAWN, piece: null },
      ],
    },
  ],
  faction: [],
  pile: [
    {
      id: PileIdEnum.ELEMENT,
      owner: null,
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
