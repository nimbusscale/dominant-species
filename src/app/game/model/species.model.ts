import {defaultPieceFactory, Piece} from '../../engine/model/piece.model';
import {AnimalKind} from "../constant/animal.constant";
import {PieceKindEnum} from "../constant/piece.constant";
import {ActionPawnPiece} from "./action-pawn.model";

export interface SpeciesPiece extends Piece {
  owner: AnimalKind
}
