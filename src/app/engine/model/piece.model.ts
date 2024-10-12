export interface Piece {
  kind: string;
  owner: string | null
}

export type PieceFactory = (kind: string, owner?: string | null) => Piece;

export function defaultPieceFactory(kind: string, owner: string | null = null): Piece {
  return { kind: kind , owner: owner};
}
