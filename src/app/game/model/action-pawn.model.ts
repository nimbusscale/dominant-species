import { defaultPieceFactory, Piece } from '../../engine/model/piece.model';
import {ActionPawnKind, animalByActionPawnKind, PieceKindEnum} from '../constant/piece.constant';
import { getOrThrow } from '../../engine/util';
import {AnimalKind} from "../constant/animal.constant";

export interface ActionPawnPiece extends Piece {
  owner: AnimalKind
}

export function actionPawnFactory(owner: AnimalKind): ActionPawnPiece {
  return defaultPieceFactory(PieceKindEnum.ACTION_PAWN, owner) as ActionPawnPiece;
}
