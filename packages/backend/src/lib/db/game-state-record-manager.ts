import {
  Entity,
  FormattedItem,
  number,
  PutItemCommand,
  schema,
  string,
  QueryCommand,
} from 'dynamodb-toolbox';
import { GameTable } from './table';
import { GameState, GameStatePatch } from 'api-types/src/game-state';

export const GameStateEntity = new Entity({
  table: GameTable,
  name: 'GAME_STATE',
  schema: schema({
    gameId: string().savedAs('id').key(),
    record: string().key(),
    patchId: number(),
    patch: string(),
  }),
});

export type GameStateEntityType = FormattedItem<typeof GameStateEntity>;

export class GameStateRecordManager {
  private readonly gameStateEntity: typeof GameStateEntity;
  private readonly gameTable: typeof GameTable;

  constructor(gameStateEntity: typeof GameStateEntity) {
    this.gameStateEntity = gameStateEntity;
    this.gameTable = gameStateEntity.table;
  }

  async addInitialGameState(gameState: GameState): Promise<void> {
    void (await this.gameStateEntity
      .build(PutItemCommand)
      .item({
        gameId: gameState.gameId,
        /* Initial gameState record uses :0 to facilitate checking to see if a record exists.
         If TS was used, then the record would be different every time function is run. */
        record: 'gameState:0',
        patchId: 0,
        patch: '[]',
      })
      .options({
        condition: {
          and: [
            { attr: 'gameId', ne: gameState.gameId },
            { attr: 'record', ne: 'gameState:0' },
          ],
        },
      })
      .send());
  }

  async addGameStatePatch(gsp: GameStatePatch): Promise<void> {
    void (await this.gameStateEntity
      .build(PutItemCommand)
      .item({
        gameId: gsp.gameId,
        // TS used to ensure they sort with the latest on top. This is because the record is a string.
        record: `gameState:${String(Date.now())}`,
        patchId: gsp.patchId,
        patch: JSON.stringify(gsp.patch),
      })
      .send());
  }

  async getLatestGameStateRecord(gameId: string): Promise<GameStateEntityType | null> {
    const result = await this.gameTable
      .build(QueryCommand)
      .query({
        partition: gameId,
        range: { beginsWith: 'gameState:' },
      })
      .entities(GameStateEntity)
      .options({
        limit: 1,
        reverse: true,
      })
      .send();

    if (result.Items?.length) {
      return result.Items[0];
    } else {
      return null;
    }
  }
}
