import { Piece } from '../../engine/model/piece.model';
import { AnimalKind } from '../constant/animal.constant';

export interface SpeciesPiece extends Piece {
  owner: AnimalKind;
}
