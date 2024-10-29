import { ElementKind } from '../constant/element.constant';
import { Piece } from 'api-types/src/game-state';

export interface ElementPiece extends Piece {
  kind: ElementKind;
  owner: null;
}
