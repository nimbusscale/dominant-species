import { AnimalKind } from '../constant/animal.constant';
import { Piece } from 'api-types/src/game-state';

export interface SpeciesPiece extends Piece {
  owner: AnimalKind;
}
