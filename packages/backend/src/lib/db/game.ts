import {boolean, Entity, list, number, PutItemCommand, schema, string} from 'dynamodb-toolbox';
import { GameTable } from './table';
import { Game } from '../../../../api-types/src/game'

const GameEntity = new Entity({
  table: GameTable,
  name: 'GAME',
  schema: schema({
    username: string().savedAs('id').key(),
    record: string().key(),
    gameId: string(),
    host: string(),
    players: list(string()),
    startTs: number().default(() => Math.floor(Date.now() / 1000)),
    complete: boolean().default(false)
  })
})

export async function addGame(game: Game): Promise<void> {
  const putPromises = game.players.map((player) => {
    return GameEntity.build(PutItemCommand).item(
      {
        username: player,
        record: `game:${game.gameId}`,
        gameId: game.gameId,
        host: game.host,
        players: game.players
      }
    ).send()
  })
  await Promise.all(putPromises)
}

