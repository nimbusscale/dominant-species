export interface Game {
  gameId: string;
  host: string;
  playerIds: string[];
  startTS?: number;
  complete?: boolean;
}

export interface GameCollection {
  games: Game[];
}
