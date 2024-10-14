import { defaultPieceFactory, Piece } from '../../engine/model/piece.model';
import { PieceKindEnum } from '../constant/piece.constant';
import { AnimalKind } from '../constant/animal.constant';

export interface ActionPawnPiece extends Piece {
  owner: AnimalKind;
}
