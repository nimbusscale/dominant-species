import { defaultPieceFactory, Piece } from '../../engine/model/piece.model';

import {ElementEnum, ElementKind} from "../constant/element.constant";

export interface ElementPiece extends Piece {
  kind: ElementKind;
  owner: null;
}

export function elementPieceFactory(kind: string): ElementPiece {
  return defaultPieceFactory(kind, null) as ElementPiece;
}
