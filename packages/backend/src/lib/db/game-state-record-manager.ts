import {Entity, FormattedItem, number, PutItemCommand, schema, string, Table} from 'dynamodb-toolbox';
import {GameTable} from './table';
import {Game} from 'api-types/src/game';
import {GameStatePatch} from "api-types/src/game-state";
import {QueryCommand} from "@aws-sdk/lib-dynamodb";


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

type GameStateEntityType = FormattedItem<typeof GameStateEntity>;

export class GameStateRecordManager {
  private readonly gameStateEntity: Entity;
  private readonly gameTable: Table;

  constructor(gameStateEntity: Entity) {
    this.gameStateEntity = gameStateEntity;
    this.gameTable = gameStateEntity.table;
  }

  async addInitialGameState(game: Game): Promise<void> {
    void (await this.gameStateEntity
      .build(PutItemCommand)
      .item({
        gameId: game.gameId,
        /* Initial gameState record uses :0 to facilitate checking to see if a record exists.
         If TS was used, then the record would be different every time function is run. */
        record: 'gameState:0',
        patchId: 0,
        patch: '[]',
      }).options({
          condition: {
            and: [
              {attr: 'gameId', ne: game.gameId},
              {attr: 'record', ne: 'gameState:0'}]
          }
        }
      )
      .send());
  }

  async addGameStatePatch(gsp: GameStatePatch): Promise<void> {
    void await this.gameStateEntity.build(PutItemCommand).item(
      {
        gameId: gsp.gameId,
        // TS used to ensure they sort with the latest on top. This is because the record is a string.
        record: `gameState:${Date.now()}`,
        patchId: gsp.patchId,
        patch: gsp.patch
      }
    ).send()
  }

  //using DocClient directly due to this issue: https://github.com/dynamodb-toolbox/dynamodb-toolbox/issues/980
  async getLatestGameStateRecord(gameId: string): Promise<GameStateEntityType | null> {
    const command = new QueryCommand({
      TableName: this.gameTable.getName(),
      KeyConditionExpression:
        "id = :id AND begins_with(#record, :record)",
      ExpressionAttributeValues: {
        ":id": gameId,
        ":record": "gameState:",
      },
      ExpressionAttributeNames: {"#record": "record"},
      ScanIndexForward: false,
      Limit: 1
    });

    const result = await this.gameTable.getDocumentClient().send(command)
    if (result.Items && result.Items.length === 1) {
      return result.Items[0] as GameStateEntityType
    } else {
      return null
    }
  }
}
