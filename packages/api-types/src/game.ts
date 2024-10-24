export interface Game {
  gameId: string,
  host: string,
  players: string[],
  startTs?: number,
  complete?: boolean
}
