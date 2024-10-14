import {defaultPieceFactory, Piece} from "../../engine/model/piece.model";
import {ActionPawnKind, animalByActionPawnKind} from "../constant/piece.constant";
import {getOrThrow} from "../../engine/util";

export interface ActionPawnPiece extends Piece{
  kind: ActionPawnKind
}

export function actionPawnFactory(kind: string): ActionPawnPiece {
  const owner = getOrThrow(animalByActionPawnKind, kind)
  return defaultPieceFactory(kind, owner) as ActionPawnPiece
}
