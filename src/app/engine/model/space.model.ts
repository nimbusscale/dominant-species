import {Action} from "./action.model";
import {Piece} from "./piece.model";
import {Pile} from "./pile.model";

interface BaseSpace {
  kind: string
  action: Action[]
}

export type Space = PieceSpace | PileSpace

export interface PieceSpace extends BaseSpace {
  item: Piece[]
}

export interface PileSpace extends BaseSpace {
  item: Pile[]
}
