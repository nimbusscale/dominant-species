import {Entity, list, number, schema, string} from "dynamodb-toolbox";
import {GameTable} from "./table";

export const GameStateEntity = new Entity(
  {
    table: GameTable,
    name: 'GAME_STATE',
    schema: schema( {
      gameId: string().savedAs('id').key(),
      record: string().key(),
      patchId: number(),
      patch: string(),
    })
  })
