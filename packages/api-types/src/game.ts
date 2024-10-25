export interface Game {
  gameId: string,
  host: string,
  players: string[],
  startTS?: number,
  complete?: boolean
}
