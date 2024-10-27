export interface Player {
  username: string,
  friends: Set<string>
}

export interface PlayerCollection {
  players: Player[]
}
