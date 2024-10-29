import { AnimalKind } from '../constant/animal.constant';
import { Piece } from 'api-types/src/game-state';

export interface ActionPawnPiece extends Piece {
  owner: AnimalKind;
}
