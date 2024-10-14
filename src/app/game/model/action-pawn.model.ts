import { defaultPieceFactory, Piece } from '../../engine/model/piece.model';
import { PieceKindEnum } from '../constant/piece.constant';
import { AnimalKind } from '../constant/animal.constant';

export interface ActionPawnPiece extends Piece {
  owner: AnimalKind;
}

export function actionPawnFactory(kind: string): ActionPawnPiece {
  return defaultPieceFactory(PieceKindEnum.ACTION_PAWN, kind) as ActionPawnPiece;
}
