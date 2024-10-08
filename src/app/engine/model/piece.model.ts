export interface Piece {
  kind: string;
}

export type PieceFactory = (kind: string) => Piece;

export function defaultPieceFactory(kind: string): Piece {
  return { kind: kind };
}
