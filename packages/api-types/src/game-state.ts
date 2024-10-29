export interface GameElementState {
  id: string;
}

export interface FactionState extends GameElementState {
  name: string;
  ownerId: string;
  score: number;
}

export interface PileState extends GameElementState {
  owner: string | null;
  inventory: Record<string, number>;
}

export interface Piece {
  kind: string;
  owner: string | null;
  name: string;
}

export interface SpaceState {
  kind: string;
  piece: Piece | null;
}

export interface AreaState extends GameElementState {
  space: SpaceState[];
}

export interface GameElementStates {
  area: AreaState[];
  faction: FactionState[];
  pile: PileState[];
}

export interface GameState {
  id: string,
  patch: number,
  playerIds: string[],
  gameElements: GameElementStates,
}
