import {Entity, FormattedItem, list, number, PutItemCommand, schema, string, Table} from "dynamodb-toolbox";
import {GameTable} from "./table";
import {Game} from "api-types/src/game";
import {GameStatePatch} from "api-types/src/game-state";

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

type GameStateEntityType = FormattedItem<typeof GameStateEntity>;

export class GameStateRecordManager {
  private readonly gameStateEntity: Entity;
  private readonly gameTable: Table;
  constructor(gameStateEntity: Entity) {
    this.gameStateEntity = gameStateEntity;
    this.gameTable = gameStateEntity.table;
  }

  async addInitialGameState(game: Game): Promise<void> {
    void await this.gameStateEntity.build(PutItemCommand).item(
      {
      gameId: game.gameId,
      record: `gameState:${String(Date.now())}`,
      patchId: 0,
      patch: '[]'
    }
    ).send()
  }
}
