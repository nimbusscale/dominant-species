import {defaultPieceFactory, Piece} from "../../engine/model/piece.model";
import {ActionPawnKind, AnimalKind, ElementKind} from "../dominant-species.constants";

export interface ElementPiece extends Piece{
  kind: ElementKind,
  owner: null
}

export function elementPieceFactory(kind: ElementKind): ElementPiece {
  return defaultPieceFactory(kind, null) as ElementPiece
}

