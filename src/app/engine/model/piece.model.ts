export interface Piece {
  kind: string;
}

// Todo: Should be an interface? /
export type PieceFactory = (kind: string) => Piece;

export function defaultPieceFactory(kind: string): Piece {
  return { kind: kind }
}
