import { startCase } from 'lodash';

export interface Piece {
  kind: string;
  owner: string | null;
  name: string;
}

export type PieceFactory = (kind: string, owner?: string | null, name?: string | null) => Piece;

export function defaultPieceFactory(
  kind: string,
  owner: string | null = null,
  name: string | null = null,
): Piece {
  return { kind: kind, owner: owner, name: name ? name : startCase(kind) };
}
