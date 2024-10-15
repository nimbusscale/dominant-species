import { Piece } from '../../engine/model/piece.model';
import { AnimalKind } from '../constant/animal.constant';

export interface ActionPawnPiece extends Piece {
  owner: AnimalKind;
}
