import {
  boolean,
  Entity,
  FormattedItem,
  list,
  number,
  PutItemCommand,
  QueryCommand,
  schema,
  string,
  Table,
  UpdateItemCommand,
} from 'dynamodb-toolbox';
import { GameTable, GameTableIndex } from './table';
import { Game } from '../../../../api-types/src/game';

export const GameEntity = new Entity({
  table: GameTable,
  name: 'GAME',
  schema: schema({
    username: string().savedAs('id').key(),
    record: string().key(),
    gameId: string(),
    host: string(),
    players: list(string()),
    startTS: number().default(() => Math.floor(Date.now() / 1000)),
    complete: boolean().default(false),
  }),
});

type GameEntityType = FormattedItem<typeof GameEntity>;

export class GameRecordManager {
  private readonly gameEntity: Entity;
  private readonly gameTable: Table;
  constructor(gameEntity: Entity) {
    this.gameEntity = gameEntity;
    this.gameTable = gameEntity.table;
  }

  private gameEntityToGame({
    gameId,
    host,
    players,
    startTS,
    complete,
  }: GameEntityType): Game {
    return { gameId, host, players, startTS, complete };
  }

  async addGame(game: Game): Promise<void> {
    const putPromises = game.players.map((player) => {
      return this.gameEntity
        .build(PutItemCommand)
        .item({
          username: player,
          record: `game:${game.gameId}`,
          gameId: game.gameId,
          host: game.host,
          players: game.players,
        })
        .send();
    });
    void (await Promise.all(putPromises));
  }

  async getGamesForPlayer(username: string, includeCompleted = false): Promise<Game[]> {
    const result = await this.gameTable
      .build(QueryCommand)
      .query({
        index: GameTableIndex.BY_PLAYER_START,
        partition: username,
      })
      .entities(this.gameEntity)
      .options({
        limit: 10,
        reverse: true,
        ...(includeCompleted ? {} : { filters: { GAME: { attr: 'complete', eq: false } } }),
      })
      .send();

    if (result.Items) {
      return result.Items.map((gameEntity) => this.gameEntityToGame(gameEntity as GameEntityType));
    } else {
      throw new Error(`Unexpected result: ${JSON.stringify(result)}`);
    }
  }

  private async getGameEntitiesByGameId(gameId: string): Promise<GameEntityType[]> {
    const result = await this.gameTable
      .build(QueryCommand)
      .query({
        index: GameTableIndex.BY_GAME_ID,
        partition: gameId,
      })
      .entities(this.gameEntity)
      .send();

    if (result.Items?.length) {
      return result.Items as GameEntityType[];
    } else {
      throw new Error(`No GameEntities returned for game ${gameId}: ${JSON.stringify(result)}`);
    }
  }

  async completeGame(gameId: string): Promise<void> {
    const gameEntities = await this.getGameEntitiesByGameId(gameId);
    const updatePromises = gameEntities.map((gameEntity: GameEntityType) => {
      return this.gameEntity
        .build(UpdateItemCommand)
        .item({
          username: gameEntity.username,
          record: `game:${gameEntity.gameId}`,
          complete: true,
        })
        .send();
    });
    void (await Promise.all(updatePromises));
  }
}
